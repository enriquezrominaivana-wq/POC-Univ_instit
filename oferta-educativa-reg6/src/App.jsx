import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import { useFetchData } from './hooks/useFetchData.js';
import { useUserLocation } from './hooks/useUserLocation.js';
import {
  CATEGORIAS,
  ORDEN_CATEGORIAS,
  calcularMetricas,
  filtrarRegistros,
  listarMunicipios,
} from './utils/metrics';

// deck.gl + maplibre-gl pesan bastante: se cargan aparte del dashboard.
const MapView = lazy(() => import('./components/MapView.jsx'));

export default function App() {
  const { loading, registros, error, fuente } = useFetchData();
  const { status, coords, error: errorUbicacion, solicitar } = useUserLocation();

  const [municipio, setMunicipio] = useState('todos');
  const [categorias, setCategorias] = useState(ORDEN_CATEGORIAS);
  const [foco, setFoco] = useState(null);
  const [centrarPendiente, setCentrarPendiente] = useState(false);

  // Centrar el mapa cuando la ubicación llega tras tocar "Mi Ubicación".
  useEffect(() => {
    if (status === 'ready' && coords && centrarPendiente) {
      setFoco({ ...coords, key: Date.now() });
      setCentrarPendiente(false);
    }
  }, [status, coords, centrarPendiente]);

  const municipios = useMemo(() => listarMunicipios(registros), [registros]);

  // Registros filtrados por municipio (para los conteos por categoría).
  const registrosPorMunicipio = useMemo(
    () => filtrarRegistros(registros, { municipio }),
    [registros, municipio],
  );

  // Registros visibles en el mapa y en el dashboard.
  const registrosVisibles = useMemo(
    () => filtrarRegistros(registros, { municipio, categorias }),
    [registros, municipio, categorias],
  );

  const metricas = useMemo(() => calcularMetricas(registrosVisibles), [registrosVisibles]);

  const conteoPorCategoria = useMemo(() => {
    const conteo = { [CATEGORIAS.PUBLICA]: 0, [CATEGORIAS.PRIVADA]: 0, [CATEGORIAS.INSTITUTO]: 0 };
    registrosPorMunicipio.forEach((fila) => {
      conteo[fila.categoria] = (conteo[fila.categoria] || 0) + 1;
    });
    return conteo;
  }, [registrosPorMunicipio]);

  const toggleCategoria = (categoria) => {
    setCategorias((prev) => {
      const activa = prev.includes(categoria);
      if (activa && prev.length === 1) return prev; // siempre al menos una activa
      return activa ? prev.filter((c) => c !== categoria) : [...prev, categoria];
    });
  };

  const limpiarFiltros = () => {
    setMunicipio('todos');
    setCategorias(ORDEN_CATEGORIAS);
  };

  const manejarMiUbicacion = () => {
    if (status === 'ready' && coords) {
      setFoco({ ...coords, key: Date.now() });
      return;
    }
    setCentrarPendiente(true);
    solicitar();
  };

  if (loading) {
    return (
      <div className="cargando" role="status" aria-live="polite">
        <Loader2 size={28} className="girar" />
        <p>Cargando oferta educativa…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        municipios={municipios}
        municipio={municipio}
        onMunicipio={setMunicipio}
        categorias={categorias}
        onToggleCategoria={toggleCategoria}
        onLimpiarFiltros={limpiarFiltros}
        conteoPorCategoria={conteoPorCategoria}
        conteoTotal={registros.length}
        conteoFiltrado={registrosVisibles.length}
        ubicacion={coords}
        estadoUbicacion={status}
        errorUbicacion={errorUbicacion}
        onMiUbicacion={manejarMiUbicacion}
        fuente={fuente}
        errorDatos={error}
      />

      <main className="contenido">
        <Dashboard
          metricas={metricas}
          municipioActivo={municipio}
          onSelectMunicipio={setMunicipio}
        />
        <Suspense
          fallback={
            <div className="mapa mapa--cargando" role="status" aria-live="polite">
              <Loader2 size={24} className="girar" />
              <p>Cargando el mapa…</p>
            </div>
          }
        >
          <MapView
            registros={registrosVisibles}
            ubicacion={coords}
            estadoUbicacion={status}
            foco={foco}
            onMiUbicacion={manejarMiUbicacion}
            onReset={() => setFoco(null)}
          />
        </Suspense>
      </main>
    </div>
  );
}
