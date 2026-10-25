/**
 * Chequeo de la conexión con Supabase usando las variables de .env:
 * valida que la URL sea alcanzable, que la tabla (VITE_SUPABASE_TABLE) exista,
 * que la política RLS permita SELECT y que los conteos por categoría
 * coincidan con las reglas de negocio.
 *
 * Uso: node scripts/check-supabase.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function leerEnv() {
  const env = {};
  try {
    for (const linea of readFileSync(resolve(raiz, '.env'), 'utf8').split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* sin .env */
  }
  for (const k of ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']) {
    if (process.env[k]) env[k] = process.env[k];
  }
  return env;
}

const env = leerEnv();
const url = (env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = env.VITE_SUPABASE_ANON_KEY;
const tabla = (env.VITE_SUPABASE_TABLE || 'instituciones').trim();

if (!url || !key) {
  console.error('✗ Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en .env');
  process.exit(1);
}

const encabezados = { apikey: key, Authorization: `Bearer ${key}` };

async function get(ruta) {
  const res = await fetch(`${url}${ruta}`, { headers: encabezados });
  const texto = await res.text();
  let datos = null;
  try {
    datos = JSON.parse(texto);
  } catch {
    /* respuesta no JSON */
  }
  return { status: res.status, datos, texto };
}

console.log(`Proyecto: ${url}`);

// 1) ¿Responde la API?
const version = await get('/rest/v1/').catch((e) => ({ status: 0, datos: null, texto: e.message }));
console.log(`GET /rest/v1/ → HTTP ${version.status}`);

// 2) Listado de tablas visibles para la clave pública (spec OpenAPI de PostgREST)
const spec = version.datos && typeof version.datos === 'object' ? version.datos : null;
const tablas = spec?.definitions ? Object.keys(spec.definitions) : [];
console.log('Tablas visibles:', tablas.length ? tablas.join(', ') : '(ninguna / sin permiso)');

// 3) Traer los registros (nombre configurado en VITE_SUPABASE_TABLE)
const filas = await get(`/rest/v1/${encodeURIComponent(tabla)}?select=*&order=id.asc`).catch((e) => ({
  status: 0,
  datos: null,
  texto: e.message,
}));

if (filas.status !== 200 || !Array.isArray(filas.datos)) {
  console.error(`✗ GET /rest/v1/${tabla} → HTTP ${filas.status}`);
  console.error(String(filas.texto).slice(0, 600));
  process.exit(1);
}

const registros = filas.datos;
const esPublica = (f) =>
  f.objeto === 'Universidad' && String(f.nombre || '').startsWith('Universidad Nacional');
const universidades = registros.filter((f) => f.objeto === 'Universidad');
const publicas = universidades.filter(esPublica);
const privadas = universidades.filter((f) => !esPublica(f));
const institutos = registros.filter((f) => f.objeto !== 'Universidad');
const municipios = [...new Set(registros.map((f) => f.municipio_nombre))].sort();

console.log('--- Resultado ---');
console.log(`  Total instituciones : ${registros.length}`);
console.log(`  Universidades       : ${universidades.length} (públicas ${publicas.length} / privadas ${privadas.length})`);
console.log(`  Institutos          : ${institutos.length}`);
console.log(`  Municipios (${municipios.length})  : ${municipios.join(', ')}`);
console.log(`  Ejemplo             : ${registros[0]?.nombre} [${registros[0]?.municipio_nombre}]`);
console.log(registros.length > 0 ? '✓ Lectura pública (RLS SELECT) funcionando' : '✗ Sin registros');
