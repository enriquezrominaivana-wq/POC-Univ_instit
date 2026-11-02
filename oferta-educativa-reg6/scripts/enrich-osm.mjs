/**
 * Enriquece src/data/instituciones.js con datos de OpenStreetMap (Nominatim):
 *   sitio_web, direccion y telefono de cada universidad/instituto.
 *
 * No requiere API key. Respeta la política de uso de Nominatim (≤1 req/s).
 *
 * Uso:  npm run data:enrich
 * Salida: src/data/enriquecimiento.json  (clave = id de la institución)
 * Reintentables: si se interrumpe, al volver a ejecutar retoma los ids ya hechos.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(__dirname, '..');
const salida = resolve(raiz, 'src', 'data', 'enriquecimiento.json');

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'oferta-educativa-reg6/1.0 (enriquecimiento OSM local)';
const DISTANCIA_MAX_M = 1500; // tolerancia entre coordenadas del dataset y OSM
const PAUSA_MS = 1200; // Nominatim pide ≤1 consulta por segundo

const { LOCAL_INSTITUCIONES } = await import(resolve(raiz, 'src', 'data', 'instituciones.js'));

function cargarPrevio() {
  try {
    return JSON.parse(readFileSync(salida, 'utf8'));
  } catch {
    return {};
  }
}

function guardar(datos) {
  const ordenado = Object.fromEntries(
    Object.keys(datos)
      .map(Number)
      .sort((a, b) => a - b)
      .map((id) => [String(id), datos[String(id)]]),
  );
  writeFileSync(salida, `${JSON.stringify(ordenado, null, 2)}\n`, 'utf8');
}

function dormir(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Similitud de Jaccard sobre tokens (0..1). */
function similitud(a, b) {
  const ta = new Set(normalizar(a).split(' ').filter((t) => t.length > 2));
  const tb = new Set(normalizar(b).split(' ').filter((t) => t.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  ta.forEach((t) => {
    if (tb.has(t)) inter += 1;
  });
  return inter / (ta.size + tb.size - inter);
}

function distanciaM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function armarDireccion(address) {
  if (!address) return null;
  const calle = address.road || address.pedestrian || address.neighbourhood;
  const altura = address.house_number;
  if (calle && altura) return `${calle} ${altura}`;
  if (calle) return calle;
  return null;
}

function normalizarWeb(url) {
  if (!url) return null;
  const limpio = String(url).trim();
  if (!limpio) return null;
  return /^https?:\/\//i.test(limpio) ? limpio : `https://${limpio}`;
}

async function buscarNominatim(q) {
  const url = `${NOMINATIM}?${new URLSearchParams({
    q,
    format: 'jsonv2',
    addressdetails: '1',
    extratags: '1',
    limit: '5',
  })}`;

  for (const intento of [1, 2, 3]) {
    const respuesta = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (respuesta.status === 429 || respuesta.status === 503) {
      const espera = 5000 * intento;
      console.warn(`  ⏳ Nominatim ocupado (${respuesta.status}); espero ${espera}ms…`);
      await dormir(espera);
      continue;
    }
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return respuesta.json();
  }
  throw new Error('Nominatim no respondió tras 3 intentos');
}

function elegirMejor(resultados, registro) {
  const candidatos = (resultados || [])
    .map((r) => {
      const lat = Number(r.lat);
      const lon = Number(r.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const dist = distanciaM(registro.latitud, registro.longitud, lat, lon);
      if (dist > DISTANCIA_MAX_M) return null;
      const sim = Math.max(
        similitud(registro.nombre, r.name),
        similitud(registro.nombre, r.namedetails?.alt_name),
        similitud(registro.nombre, r.namedetails?.official_name),
      );
      return { r, dist, sim };
    })
    .filter(Boolean)
    .filter((c) => c.sim >= 0.34 || c.dist <= 350)
    .sort((a, b) => b.sim - a.sim || a.dist - b.dist);

  return candidatos[0]?.r ?? null;
}

/**
 * Variantes de consulta: el nombre completo + municipio suele fallar por
 * sufijos ("Sede X", "Campus", "Delegación Y"); se prueban versiones más
 * cortas hasta dar con el lugar en OSM (el filtro por distancia evita
 * falsos positivos).
 */
function variantesConsulta(registro) {
  const base = `${registro.nombre}, ${registro.municipio_nombre}, Buenos Aires, Argentina`;
  const soloNombre = registro.nombre;
  const palabras = soloNombre.split(/\s+/);
  const variantes = [base, soloNombre];
  for (let n = 1; n <= 3 && palabras.length - n >= 3; n += 1) {
    variantes.push(palabras.slice(0, palabras.length - n).join(' '));
  }
  return [...new Set(variantes)];
}

async function buscarPara(registro) {
  for (const q of variantesConsulta(registro)) {
    const resultados = await buscarNominatim(q);
    const mejor = elegirMejor(resultados, registro);
    if (mejor) return mejor;
    await dormir(PAUSA_MS);
  }
  return null;
}

const datos = cargarPrevio();
const pendientes = LOCAL_INSTITUCIONES.filter((inst) => !datos[String(inst.id)]);

console.log(
  `ℹ ${LOCAL_INSTITUCIONES.length} instituciones · ${Object.keys(datos).length} ya enrichadas · ${pendientes.length} por hacer`,
);

let hechas = 0;
for (const inst of pendientes) {
  hechas += 1;
  const etiqueta = `[${hechas}/${pendientes.length}] #${inst.id} ${inst.nombre}`;
  try {
    const mejor = await buscarPara(inst);

    if (!mejor) {
      console.log(`${etiqueta} → sin coincidencia en OSM`);
    } else {
      const et = mejor.extratags || {};
      const entrada = {};
      const web = normalizarWeb(et.website || et['contact:website'] || et.url);
      const dir = armarDireccion(mejor.address);
      const tel = (et.phone || et['contact:phone'] || '').trim() || null;
      if (web) entrada.sitio_web = web;
      if (dir) entrada.direccion = dir;
      if (tel) entrada.telefono = tel;

      if (Object.keys(entrada).length === 0) {
        console.log(`${etiqueta} → OSM sin datos útiles (${mejor.display_name})`);
      } else {
        datos[String(inst.id)] = entrada;
        console.log(
          `${etiqueta} → ✔ ${[web && 'web', dir && 'dirección', tel && 'tel'].filter(Boolean).join(', ')}`,
        );
      }
    }
  } catch (error) {
    console.warn(`${etiqueta} → ✖ ${error.message}`);
  }

  if (hechas % 10 === 0) guardar(datos);
  await dormir(PAUSA_MS);
}

guardar(datos);
const conWeb = Object.values(datos).filter((d) => d.sitio_web).length;
const conDir = Object.values(datos).filter((d) => d.direccion).length;
console.log(
  `✔ Listo: ${Object.keys(datos).length} enriquecidas (${conWeb} con web, ${conDir} con dirección) → ${salida}`,
);
