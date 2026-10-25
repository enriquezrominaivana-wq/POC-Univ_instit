/**
 * Tarjeta individual de métrica (KPI Card).
 */
export default function KpiCard({ titulo, valor, icono, color = '#2563eb', detalle }) {
  return (
    <article className="kpi" style={{ '--kpi-color': color }}>
      <div className="kpi__icono" aria-hidden="true">
        {icono}
      </div>
      <div className="kpi__contenido">
        <p className="kpi__valor">{valor}</p>
        <h3 className="kpi__titulo">{titulo}</h3>
        {detalle && <p className="kpi__detalle">{detalle}</p>}
      </div>
    </article>
  );
}
