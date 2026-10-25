/**
 * Distribución por municipio: gráfico de barras apiladas
 * (universidades públicas / privadas / institutos) + totales.
 * Al hacer clic se filtra el mapa y el dashboard por ese municipio.
 */
export default function MunicipalitiesChart({ grupos = [], municipioActivo, onSelect }) {
  const maximo = Math.max(1, ...grupos.map((g) => g.total));

  if (grupos.length === 0) {
    return (
      <div className="chart">
        <p className="chart__vacio">No hay datos para los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="chart">
      <div className="chart__cabecera">
        <h3 className="chart__titulo">Distribución por municipio</h3>
        <ul className="chart__leyenda">
          <li><span style={{ background: '#2563eb' }} /> Públicas</li>
          <li><span style={{ background: '#16a34a' }} /> Privadas</li>
          <li><span style={{ background: '#ea580c' }} /> Institutos</li>
        </ul>
      </div>

      <div className="chart__cuerpo">
        <ul className="chart__lista">
          {grupos.map((grupo) => {
            const activo = municipioActivo === grupo.municipio;
            const alternar = () => onSelect(activo ? 'todos' : grupo.municipio);

            return (
              <li key={grupo.municipio} className={`chart__fila ${activo ? 'is-activo' : ''}`}>
                <button
                  type="button"
                  className="chart__etiqueta"
                  onClick={alternar}
                  title={`Filtrar por ${grupo.municipio}`}
                >
                  {grupo.municipio}
                </button>
                <button
                  type="button"
                  className="chart__barra"
                  onClick={alternar}
                  aria-label={`${grupo.municipio}: ${grupo.total} instituciones`}
                  title={`${grupo.publicas} públicas · ${grupo.privadas} privadas · ${grupo.institutos} institutos`}
                >
                  <span
                    className="chart__segmento"
                    style={{ width: `${(grupo.publicas / maximo) * 100}%`, background: '#2563eb' }}
                  />
                  <span
                    className="chart__segmento"
                    style={{ width: `${(grupo.privadas / maximo) * 100}%`, background: '#16a34a' }}
                  />
                  <span
                    className="chart__segmento"
                    style={{ width: `${(grupo.institutos / maximo) * 100}%`, background: '#ea580c' }}
                  />
                </button>
                <span className="chart__valor">{grupo.total}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
