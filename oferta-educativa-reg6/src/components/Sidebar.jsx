import { Landmark, GraduationCap, Building2, School, MapPin, Loader2, Database, Filter, X } from 'lucide-react';
import { CATEGORIAS, CATEGORIA_META, ORDEN_CATEGORIAS, formatearNumero } from '../utils/metrics';

/**
 * Panel lateral: filtros por municipio y tipo de institución,
 * leyenda de colores, botón "Mi Ubicación" y origen de los datos.
 * En móvil/tablet se comporta como un drawer deslizante (props `abierta`/`onCerrar`).
 */
export default function Sidebar({
  municipios = [],
  municipio = 'todos',
  onMunicipio,
  categorias = ORDEN_CATEGORIAS,
  onToggleCategoria,
  onLimpiarFiltros,
  conteoPorCategoria = {},
  conteoTotal = 0,
  conteoFiltrado = 0,
  ubicacion = null,
  estadoUbicacion = 'idle',
  errorUbicacion = null,
  onMiUbicacion,
  fuente = null,
  errorDatos = null,
  id,
  abierta = false,
  onCerrar,
}) {
  const ICONOS = {
    [CATEGORIAS.PUBLICA]: <GraduationCap size={16} />,
    [CATEGORIAS.PRIVADA]: <Building2 size={16} />,
    [CATEGORIAS.INSTITUTO]: <School size={16} />,
  };

  const hayFiltros = municipio !== 'todos' || categorias.length < ORDEN_CATEGORIAS.length;
  const localizando = estadoUbicacion === 'loading';

  return (
    <aside id={id} className={`sidebar ${abierta ? 'is-abierta' : ''}`}>
      <header className="sidebar__cabecera">
        <span className="sidebar__logo" aria-hidden="true">
          <Landmark size={22} />
        </span>
        <div>
          <h1 className="sidebar__titulo">Oferta Educativa Superior</h1>
          <p className="sidebar__subtitulo">Región Educativa 6 y alrededores</p>
        </div>
        <button
          type="button"
          className="sidebar__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar filtros"
        >
          <X size={20} />
        </button>
      </header>

      <div className="sidebar__bloque">
        <div className="sidebar__fila-titulo">
          <h2 className="sidebar__titulo-bloque">
            <Filter size={15} aria-hidden="true" /> Filtros
          </h2>
          {hayFiltros && (
            <button type="button" className="sidebar__limpiar" onClick={onLimpiarFiltros}>
              <X size={13} /> Limpiar
            </button>
          )}
        </div>

        <label className="sidebar__label" htmlFor="filtro-municipio">
          Municipio
        </label>
        <select
          id="filtro-municipio"
          className="sidebar__select"
          value={municipio}
          onChange={(e) => onMunicipio(e.target.value)}
        >
          <option value="todos">Todos los municipios</option>
          {municipios.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <ul className="sidebar__categorias">
          {ORDEN_CATEGORIAS.map((categoria) => {
            const meta = CATEGORIA_META[categoria];
            const activa = categorias.includes(categoria);
            const cantidad = conteoPorCategoria[categoria] ?? 0;

            return (
              <li key={categoria}>
                <label className={`categoria ${activa ? '' : 'is-inactiva'}`}>
                  <input
                    type="checkbox"
                    checked={activa}
                    onChange={() => onToggleCategoria(categoria)}
                  />
                  <span className="categoria__swatch" style={{ background: meta.color }} aria-hidden="true" />
                  <span className="categoria__icono" aria-hidden="true">
                    {ICONOS[categoria]}
                  </span>
                  <span className="categoria__nombre">{meta.label}</span>
                  <span className="categoria__conteo">{formatearNumero(cantidad)}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <p className="sidebar__resultado">
          Mostrando <strong>{formatearNumero(conteoFiltrado)}</strong> de{' '}
          {formatearNumero(conteoTotal)} instituciones
        </p>
      </div>

      <div className="sidebar__bloque">
        <h2 className="sidebar__titulo-bloque">
          <MapPin size={15} aria-hidden="true" /> Tu ubicación
        </h2>
        <button
          type="button"
          className="sidebar__ubicacion"
          onClick={onMiUbicacion}
          disabled={localizando}
        >
          {localizando ? <Loader2 size={16} className="girar" /> : <MapPin size={16} />}
          {localizando ? 'Localizando…' : 'Mi Ubicación'}
        </button>

        {ubicacion && estadoUbicacion === 'ready' && (
          <p className="sidebar__coordenadas">
            {ubicacion.latitude.toFixed(5)}, {ubicacion.longitude.toFixed(5)}
          </p>
        )}
        {errorUbicacion && <p className="sidebar__alerta">{errorUbicacion}</p>}
      </div>

      <footer className="sidebar__pie">
        <p className="sidebar__fuente">
          <Database size={14} aria-hidden="true" />
          {fuente === 'supabase' ? 'Supabase (lectura pública)' : 'Dataset local (fallback)'}
        </p>
        {errorDatos && <p className="sidebar__alerta">{errorDatos}</p>}
        <p className="sidebar__nota-seguridad">
          Clave anónima con RLS de solo lectura: sin permisos de escritura.
        </p>
      </footer>
    </aside>
  );
}
