/**
 * Genera a partir del CSV de la hoja "Universidad_Institutos.xlsx - Hoja1":
 *   1) src/data/instituciones.js  → dataset local de fallback para la app
 *   2) supabase/seed.sql          → INSERTs para cargar la tabla `instituciones`
 *
 * Uso:  npm run data:build  (o: node scripts/build-data.mjs "../../Universidad_Institutos.xlsx - Hoja1.csv")
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(__dirname, '..');

const csvPath =
  process.argv[2] ??
  resolve(raiz, '..', 'Universidad_Institutos.xlsx - Hoja1.csv');

const COLS = ['id', 'municipio_nombre', 'municipio_id', 'objeto', 'nombre', 'longitud', 'latitud'];

// Nombre de la tabla de destino en Supabase (coincide con VITE_SUPABASE_TABLE).
const TABLA = (process.env.SUPABASE_TABLE || 'instituciones').trim();

/** Parser mínimo de CSV (respeta comillas y saltos de línea entre comillas). */
function parseCSV(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let dentroDeComillas = false;

  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    const siguiente = texto[i + 1];

    if (dentroDeComillas) {
      if (c === '"' && siguiente === '"') {
        campo += '"';
        i += 1;
      } else if (c === '"') {
        dentroDeComillas = false;
      } else {
        campo += c;
      }
    } else if (c === '"') {
      dentroDeComillas = true;
    } else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && siguiente === '\n') i += 1;
      fila.push(campo);
      campo = '';
      if (fila.some((v) => v !== '')) filas.push(fila);
      fila = [];
    } else {
      campo += c;
    }
  }

  if (campo !== '' || fila.length > 0) {
    fila.push(campo);
    if (fila.some((v) => v !== '')) filas.push(fila);
  }

  const [cabecera, ...datos] = filas;
  return datos.map((valores) => {
    const objeto = {};
    cabecera.forEach((nombre, idx) => {
      objeto[nombre.trim()] = (valores[idx] ?? '').trim();
    });
    return objeto;
  });
}

const texto = readFileSync(csvPath, 'utf8');
const registros = parseCSV(texto).map((fila) => ({
  id: Number(fila.id),
  municipio_nombre: fila.municipio_nombre,
  municipio_id: Number(fila.municipio_id),
  objeto: fila.objeto,
  nombre: fila.nombre,
  longitud: Number(fila.longitud),
  latitud: Number(fila.latitud),
}));

const invalidos = registros.filter(
  (r) => !r.nombre || !Number.isFinite(r.longitud) || !Number.isFinite(r.latitud),
);
if (invalidos.length > 0) {
  console.warn(`⚠ ${invalidos.length} fila(s) con datos inválidos descartadas.`);
}

console.log(`✔ Leídos ${registros.length} registros desde: ${csvPath}`);
console.log(`  Columnas esperadas: ${COLS.join(', ')}`);

// ── 1) Dataset local (fallback) ────────────────────────────────────────────
const salidaJS = resolve(raiz, 'src', 'data', 'instituciones.js');
mkdirSync(dirname(salidaJS), { recursive: true });

writeFileSync(
  salidaJS,
  `// ⚠ ARCHIVO GENERADO AUTOMÁTICAMENTE por scripts/build-data.mjs — no editar a mano.
// Fuente: ${csvPath.split(/[\\\\/]/).slice(-1)[0]}
// Regenerar con: npm run data:build

export const LOCAL_INSTITUCIONES = ${JSON.stringify(registros, null, 2)};
`,
  'utf8',
);
console.log(`✔ Generado: ${salidaJS}`);

// ── 2) Seed SQL para Supabase ──────────────────────────────────────────────
const sqlEscape = (v) => String(v).replace(/'/g, "''");
const filasSQL = registros
  .map(
    (r) =>
      `  (${r.id}, '${sqlEscape(r.municipio_nombre)}', ${r.municipio_id}, '${sqlEscape(r.objeto)}', '${sqlEscape(r.nombre)}', ${r.longitud}, ${r.latitud})`,
  )
  .join(',\n');

const salidaSQL = resolve(raiz, 'supabase', 'seed.sql');
mkdirSync(dirname(salidaSQL), { recursive: true });

writeFileSync(
  salidaSQL,
  `-- ⚠ ARCHIVO GENERADO AUTOMÁTICAMENTE por scripts/build-data.mjs — no editar a mano.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de supabase/schema.sql
-- Fuente: ${csvPath.split(/[\\\\/]/).slice(-1)[0]} (${registros.length} registros)
-- Tabla: public."${TABLA}"  (cambiar con: SUPABASE_TABLE=... npm run data:build)

BEGIN;

INSERT INTO public."${TABLA}"
  (id, municipio_nombre, municipio_id, objeto, nombre, longitud, latitud)
VALUES
${filasSQL}
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificación
SELECT COUNT(*) AS total FROM public."${TABLA}";
`,
  'utf8',
);
console.log(`✔ Generado: ${salidaSQL}`);
console.log('✔ Listo. Cargá schema.sql y luego seed.sql en Supabase (SQL Editor).');
