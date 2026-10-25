/**
 * Chequeo de interacciones: filtra por municipio, alterna categorías y
 * verifica que los KPIs y el gráfico reaccionen. Usa Chrome headless + CDP.
 * Uso: node scripts/check-interactions.mjs http://localhost:5173/
 */
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2] || 'http://localhost:5173/';
const port = 9400 + Math.floor(Math.random() * 90);
const profile = join(tmpdir(), `opencode-cdp-int-${Date.now()}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const errores = [];

async function esperarCDP() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      /* esperando */
    }
    await sleep(250);
  }
  throw new Error('No se pudo conectar con Chrome DevTools');
}

const leer = (ws, expresion, idRef) =>
  new Promise((resolve) => {
    idRef.n += 1;
    const id = idRef.n;
    idRef.pendientes.set(id, (r) =>
      resolve(r.result?.value ?? r.result?.description ?? r.error ?? null),
    );
    ws.send(
      JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expresion, returnByValue: true, awaitPromise: true },
      }),
    );
  });

try {
  await esperarCDP();

  const res = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: 'PUT' },
  );
  const target = await res.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const idRef = { n: 0, pendientes: new Map() };

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && idRef.pendientes.has(msg.id)) {
      idRef.pendientes.get(msg.id)(msg.result ?? msg.error);
      idRef.pendientes.delete(msg.id);
      return;
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errores.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errores.push((msg.params.args || []).map((a) => a.description ?? a.value ?? '').join(' '));
    }
  };

  await new Promise((r) => {
    ws.onopen = r;
  });
  ws.send(JSON.stringify({ id: ++idRef.n, method: 'Runtime.enable' }));
  await sleep(9000);

  const snapshot = () =>
    `JSON.stringify({
      kpis: [...document.querySelectorAll('.kpi__valor')].map(e => e.textContent),
      filas: document.querySelectorAll('.chart__fila').length,
      municipio: document.getElementById('filtro-municipio')?.value,
      resultado: document.querySelector('.sidebar__resultado')?.innerText.replace(/\\s+/g,' '),
      activas: [...document.querySelectorAll('.categoria input')].map(i => i.checked)
    })`;

  const resultados = {};
  resultados.inicial = JSON.parse(await leer(ws, snapshot(), idRef));

  // 1) Filtro por municipio
  await leer(
    ws,
    `(() => {
      const sel = document.getElementById('filtro-municipio');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(sel, 'Tigre');
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return 'ok';
    })()`,
    idRef,
  );
  await sleep(900);
  resultados.porMunicipio = JSON.parse(await leer(ws, snapshot(), idRef));

  // 2) Desactivar la categoría "Universidades Públicas"
  await leer(
    ws,
    `(() => {
      const cb = document.querySelectorAll('.categoria input')[0];
      cb.click();
      return 'ok';
    })()`,
    idRef,
  );
  await sleep(900);
  resultados.sinPublicas = JSON.parse(await leer(ws, snapshot(), idRef));

  // 3) Clic en una fila del gráfico (alterna el municipio)
  await leer(
    ws,
    `(() => { document.querySelector('.chart__etiqueta')?.click(); return 'ok'; })()`,
    idRef,
  );
  await sleep(900);
  resultados.clicChart = JSON.parse(await leer(ws, snapshot(), idRef));

  // 4) Botón "Mi ubicación" (en headless el permiso suele fallar: debe mostrar alerta, no romper)
  await leer(ws, `(() => { document.querySelector('.mapa__boton--ubicacion')?.click(); return 'ok'; })()`, idRef);
  await sleep(2500);
  resultados.ubicacion = await leer(
    ws,
    `JSON.stringify({
      alerta: document.querySelector('.sidebar__alerta')?.innerText || null,
      raiz: document.getElementById('root').children.length
    })`,
    idRef,
  );
  resultados.ubicacion = JSON.parse(resultados.ubicacion);

  console.log('=== INTERACCIONES ===');
  console.log(JSON.stringify(resultados, null, 2));
  console.log('=== ERRORES DE CONSOLA ===');
  console.log(errores.length ? errores.join('\n') : '(sin errores)');
} catch (error) {
  console.error('FALLO:', error.message);
  if (errores.length) console.error(errores.join('\n'));
  process.exitCode = 1;
} finally {
  chrome.kill();
}
