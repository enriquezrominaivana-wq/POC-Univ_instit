/**
 * Chequeo de runtime: levanta Chrome headless contra la dev server y reporta
 * el estado del DOM + errores de consola (excepciones, warnings, 4xx/5xx).
 * Uso: node scripts/check-page.mjs http://localhost:5173/
 */
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2] || 'http://localhost:5173/';
const port = 9300 + Math.floor(Math.random() * 90);
const profile = join(tmpdir(), `opencode-cdp-${Date.now()}`);

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarCDP() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      /* aún no levantó */
    }
    await sleep(250);
  }
  throw new Error('No se pudo conectar con Chrome DevTools');
}

const eventos = [];
const externos = new Set();

try {
  await esperarCDP();

  const res = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: 'PUT' },
  );
  const target = await res.json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pendientes = new Map();

  const enviar = (metodo, params = {}) =>
    new Promise((resolve) => {
      id += 1;
      pendientes.set(id, resolve);
      ws.send(JSON.stringify({ id, method: metodo, params }));
    });

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendientes.has(msg.id)) {
      pendientes.get(msg.id)(msg.result ?? msg.error);
      pendientes.delete(msg.id);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ');
      eventos.push(`[${msg.params.type}] ${args}`);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      eventos.push(`[exception] ${d.text} ${d.exception?.description || ''}`);
    }
    if (msg.method === 'Log.entryAdded') {
      const e = msg.params.entry;
      eventos.push(`[log:${e.level}] ${e.text} ${e.url || ''}`);
    }
    if (msg.method === 'Network.loadingFailed') {
      eventos.push(`[network:fail] ${msg.params.errorText} ${msg.params.type}`);
    }
    if (msg.method === 'Network.responseReceived') {
      const { status, url: u, mimeType } = msg.params.response;
      if (status >= 400) eventos.push(`[http ${status}] ${u}`);
      try {
        const host = new URL(u).hostname;
        if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
          externos.add(`${status} ${mimeType || ''} ${u.split('?')[0]}`.trim());
        }
      } catch {
        /* data: o blob: */
      }
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await enviar('Runtime.enable');
  await enviar('Log.enable');
  await enviar('Network.enable');
  await enviar('Page.enable');

  // Deja que React, deck.gl y el mapa base terminen de montar.
  await sleep(Number(process.env.CHECK_MS || 12000));

  const estado = await enviar('Runtime.evaluate', {
    expression: `(() => {
      const root = document.getElementById('root');
      const texto = document.body.innerText.replace(/\\s+/g, ' ').trim();
      return {
        readyState: document.readyState,
        rootChildren: root ? root.children.length : -1,
        rootHTMLLength: root ? root.innerHTML.length : 0,
        canvas: document.querySelectorAll('canvas').length,
        kpis: [...document.querySelectorAll('.kpi__valor')].map(e => e.textContent),
        titulos: [...document.querySelectorAll('.kpi__titulo')].map(e => e.textContent),
        chartFilas: document.querySelectorAll('.chart__fila').length,
        botones: document.querySelectorAll('.mapa__boton').length,
        texto: texto.slice(0, 400),
      };
    })()`,
    returnByValue: true,
    awaitPromise: true,
  });

  console.log('=== ESTADO DEL DOM ===');
  console.log(JSON.stringify(estado.result?.value ?? estado, null, 2));
  console.log('=== EVENTOS / ERRORES ===');
  console.log(eventos.length ? eventos.join('\n') : '(sin eventos)');
  console.log('=== RECURSOS EXTERNOS CARGADOS ===');
  const lista = [...externos];
  console.log(lista.length ? lista.slice(0, 25).join('\n') : '(ninguno)');
} catch (error) {
  console.error('FALLO DEL CHEQUEO:', error.message);
  if (eventos.length) console.error(eventos.join('\n'));
  process.exitCode = 1;
} finally {
  chrome.kill();
}
