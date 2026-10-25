import { Landmark, School, Building2, Library, GraduationCap, MapPinned } from 'lucide-react';
import KpiCard from './KpiCard.jsx';
import MunicipalitiesChart from './MunicipalitiesChart.jsx';
import { formatearNumero } from '../utils/metrics';

/**
 * Contenedor del dashboard: tarjetas KPI + distribución por municipio.
 */
export default function Dashboard({ metricas, municipioActivo, onSelectMunicipio }) {
  const {
    total = 0,
    universidades = 0,
    publicas = 0,
    privadas = 0,
    institutos = 0,
    municipios = 0,
    porMunicipio = [],
  } = metricas || {};

  return (
    <section className="dashboard" aria-label="Indicadores">
      <div className="kpis">
        <KpiCard
          titulo="Total de Instituciones"
          valor={formatearNumero(total)}
          icono={<Library size={22} />}
          color="#0f172a"
          detalle={`${formatearNumero(municipios)} municipios`}
        />
        <KpiCard
          titulo="Total de Universidades"
          valor={formatearNumero(universidades)}
          icono={<Landmark size={22} />}
          color="#1d4ed8"
        />
        <KpiCard
          titulo="Universidades Públicas"
          valor={formatearNumero(publicas)}
          icono={<GraduationCap size={22} />}
          color="#2563eb"
          detalle="Universidades Nacionales"
        />
        <KpiCard
          titulo="Universidades Privadas"
          valor={formatearNumero(privadas)}
          icono={<Building2 size={22} />}
          color="#16a34a"
        />
        <KpiCard
          titulo="Total de Institutos"
          valor={formatearNumero(institutos)}
          icono={<School size={22} />}
          color="#ea580c"
          detalle="Docentes, técnicos y artísticos"
        />
      </div>

      <div className="dashboard__chart">
        <MunicipalitiesChart
          grupos={porMunicipio}
          municipioActivo={municipioActivo}
          onSelect={onSelectMunicipio}
        />
        <p className="dashboard__nota">
          <MapPinned size={14} aria-hidden="true" />
          Hacé clic en un municipio para filtrar el mapa y los indicadores.
        </p>
      </div>
    </section>
  );
}
