import { CATEGORIA_META } from '../utils/metrics';

/**
 * Tooltip informativo sobre los marcadores del mapa:
 * nombre, tipo (categoría) y municipio.
 */
export default function Tooltip({ registro, x, y }) {
  if (!registro) return null;

  const meta = CATEGORIA_META[registro.categoria];

  return (
    <div
      className="tooltip"
      style={{ left: x, top: y }}
      role="status"
      aria-live="polite"
    >
      <div className="tooltip__cabecera">
        <span className="tooltip__punto" style={{ background: meta?.color }} aria-hidden="true" />
        <span className="tooltip__tipo">{meta?.singular || registro.objeto}</span>
      </div>
      <p className="tooltip__nombre">{registro.nombre}</p>
      <p className="tooltip__municipio">{registro.municipio_nombre}</p>
    </div>
  );
}
