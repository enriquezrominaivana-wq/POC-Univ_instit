/**
 * Reglas de clasificación y cálculo de indicadores (Fase 2 y Fase 4 del plan).
 *
 * - Universidad Pública: objeto === 'Universidad' Y nombre.startsWith('Universidad Nacional...')
 * - Universidad Privada: objeto === 'Universidad' Y NO cumple la condición de pública
 * - Instituto:            objeto !== 'Universidad' (ISFD, técnicos, conservatorios, escuelas de arte, etc.)
 */

// Datos extra (sitio web, dirección, teléfono) por id de institución:
// enriquecimiento.json lo genera scripts/enrich-osm.mjs (OpenStreetMap);
// enriquecimiento-curado.json se mantiene a mano. Son FALLBACK: solo rellenan
// los campos que la fila trae vacíos, así Supabase (o el dataset local)
// tiene prioridad cuando define un valor.
import ENRIQUECIMIENTO_OSM from '../data/enriquecimiento.json';
import ENRIQUECIMIENTO_CURADO from '../data/enriquecimiento-curado.json';

export const CATEGORIAS = {
  PUBLICA: 'universidad_publica',
  PRIVADA: 'universidad_privada',
  INSTITUTO: 'instituto',
};

const VACIO = [null, undefined, ''];

function datosExtra(fila) {
  const clave = String(fila.id);
  const extra = {
    ...(ENRIQUECIMIENTO_OSM[clave] || {}),
    ...(ENRIQUECIMIENTO_CURADO[clave] || {}),
  };
  const relleno = {};
  for (const [campo, valor] of Object.entries(extra)) {
    if (VACIO.includes(valor)) continue;
    if (VACIO.includes(fila[campo])) relleno[campo] = valor;
  }
  return relleno;
}

export const CATEGORIA_META = {
  [CATEGORIAS.PUBLICA]: {
    label: 'Universidades Públicas',
    singular: 'Universidad Pública',
    color: '#2563eb',
    rgb: [37, 99, 235],
  },
  [CATEGORIAS.PRIVADA]: {
    label: 'Universidades Privadas',
    singular: 'Universidad Privada',
    color: '#16a34a',
    rgb: [22, 163, 74],
  },
  [CATEGORIAS.INSTITUTO]: {
    label: 'Institutos',
    singular: 'Instituto',
    color: '#ea580c',
    rgb: [234, 88, 12],
  },
};

export const ORDEN_CATEGORIAS = [
  CATEGORIAS.PUBLICA,
  CATEGORIAS.PRIVADA,
  CATEGORIAS.INSTITUTO,
];

export function esUniversidad(fila) {
  return fila?.objeto === 'Universidad';
}

export function esUniversidadPublica(fila) {
  return (
    esUniversidad(fila) &&
    typeof fila?.nombre === 'string' &&
    fila.nombre.startsWith('Universidad Nacional')
  );
}

export function clasificar(fila) {
  if (!esUniversidad(fila)) return CATEGORIAS.INSTITUTO;
  return esUniversidadPublica(fila) ? CATEGORIAS.PUBLICA : CATEGORIAS.PRIVADA;
}

/**
 * Normaliza los registros crudos (Supabase o dataset local):
 * convierte coordenadas a número y agrega la categoría calculada.
 */
export function prepararRegistros(registros) {
  return (Array.isArray(registros) ? registros : [])
    .filter((fila) => {
      const longitud = Number(fila?.longitud);
      const latitud = Number(fila?.latitud);
      return Boolean(fila?.nombre) && Number.isFinite(longitud) && Number.isFinite(latitud);
    })
    .map((fila) => ({
      ...fila,
      ...datosExtra(fila),
      longitud: Number(fila.longitud),
      latitud: Number(fila.latitud),
      municipio_nombre: fila.municipio_nombre || 'Sin municipio',
      categoria: clasificar(fila),
    }));
}

/** Desglose por municipio: universidades (públicas/privadas) e institutos. */
export function agruparPorMunicipio(registros) {
  const mapa = new Map();

  registros.forEach((fila) => {
    const municipio = fila.municipio_nombre || 'Sin municipio';
    if (!mapa.has(municipio)) {
      mapa.set(municipio, {
        municipio,
        total: 0,
        universidades: 0,
        publicas: 0,
        privadas: 0,
        institutos: 0,
      });
    }
    const grupo = mapa.get(municipio);
    grupo.total += 1;
    if (fila.categoria === CATEGORIAS.INSTITUTO) {
      grupo.institutos += 1;
    } else {
      grupo.universidades += 1;
      if (fila.categoria === CATEGORIAS.PUBLICA) grupo.publicas += 1;
      else grupo.privadas += 1;
    }
  });

  return [...mapa.values()].sort((a, b) => b.total - a.total || a.municipio.localeCompare(b.municipio, 'es'));
}

/** Indicadores (KPI) del conjunto de registros. */
export function calcularMetricas(registros) {
  const total = registros.length;
  const universidades = registros.filter(esUniversidad).length;
  const publicas = registros.filter((f) => f.categoria === CATEGORIAS.PUBLICA).length;
  const privadas = registros.filter((f) => f.categoria === CATEGORIAS.PRIVADA).length;
  const institutos = registros.filter((f) => f.categoria === CATEGORIAS.INSTITUTO).length;
  const municipios = new Set(registros.map((f) => f.municipio_nombre)).size;

  return {
    total,
    universidades,
    publicas,
    privadas,
    institutos,
    municipios,
    porMunicipio: agruparPorMunicipio(registros),
  };
}

/** Filtros dinámicos por municipio y/o categoría. */
export function filtrarRegistros(registros, { municipio = 'todos', categorias = ORDEN_CATEGORIAS } = {}) {
  const activas = new Set(categorias);
  return registros.filter((fila) => {
    const coincideMunicipio = municipio === 'todos' || fila.municipio_nombre === municipio;
    const coincideCategoria = activas.has(fila.categoria);
    return coincideMunicipio && coincideCategoria;
  });
}

export function listarMunicipios(registros) {
  return [...new Set(registros.map((f) => f.municipio_nombre))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function formatearNumero(valor) {
  return Number(valor || 0).toLocaleString('es-AR');
}
