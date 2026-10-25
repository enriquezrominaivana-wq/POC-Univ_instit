import { useEffect, useMemo, useState } from 'react';
import '../services/maplibreWorker.js';
import { DeckGL } from '@deck.gl/react';
import { FlyToInterpolator } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Crosshair, Minus, Plus, RotateCcw, MapPin } from 'lucide-react';
import Tooltip from './Tooltip.jsx';
import { CATEGORIA_META } from '../utils/metrics';

// Capa base vectorial gratuita (CARTO) sin necesidad de API key.
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// Centro aproximado de la Región Educativa 6 (norte del GBA).
const INITIAL_VIEW_STATE = {
  longitude: -58.62,
  latitude: -34.5,
  zoom: 10.2,
  pitch: 0,
  bearing: 0,
};

const MIN_ZOOM = 7;
const MAX_ZOOM = 17;

const RADIUS_USUARIO = { metros: 180, halo: 900 };

export default function MapView({
  registros = [],
  ubicacion = null, // { latitude, longitude }
  estadoUbicacion = 'idle',
  foco = null, // { latitude, longitude, key }
  onMiUbicacion,
  onReset,
}) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hover, setHover] = useState(null); // { registro, x, y }

  // Recentra el mapa cuando App lo pide (botón "Mi ubicación").
  useEffect(() => {
    if (!foco) return;
    setViewState((prev) => ({
      ...prev,
      longitude: foco.longitude,
      latitude: foco.latitude,
      zoom: Math.max(prev.zoom, 13),
      transitionDuration: 1400,
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, [foco]);

  const layers = useMemo(() => {
    const capaInstituciones = new ScatterplotLayer({
      id: 'instituciones',
      data: registros,
      getPosition: (d) => [d.longitud, d.latitud],
      getFillColor: (d) => {
        const rgb = CATEGORIA_META[d.categoria]?.rgb || [100, 116, 139];
        return [rgb[0], rgb[1], rgb[2], 230];
      },
      getLineColor: [255, 255, 255, 235],
      lineWidthMinPixels: 1.5,
      stroked: true,
      filled: true,
      getRadius: RADIUS_USUARIO.metros,
      radiusUnits: 'meters',
      radiusMinPixels: 7,
      radiusMaxPixels: 32,
      pickable: true,
      onHover: ({ object, x, y }) => {
        setHover(object ? { registro: object, x, y } : null);
      },
    });

    const posicion = ubicacion ? [[ubicacion.longitude, ubicacion.latitude]] : [];

    const capaUsuarioHalo = new ScatterplotLayer({
      id: 'usuario-halo',
      data: posicion,
      getPosition: (d) => d,
      getFillColor: [217, 70, 239, 40],
      getRadius: RADIUS_USUARIO.halo,
      radiusUnits: 'meters',
      pickable: false,
    });

    const capaUsuario = new ScatterplotLayer({
      id: 'usuario',
      data: posicion,
      getPosition: (d) => d,
      getFillColor: [217, 70, 239, 255],
      getLineColor: [255, 255, 255, 255],
      lineWidthMinPixels: 2,
      stroked: true,
      filled: true,
      getRadius: RADIUS_USUARIO.metros,
      radiusUnits: 'meters',
      radiusMinPixels: 9,
      radiusMaxPixels: 16,
      pickable: false,
    });

    return [capaInstituciones, capaUsuarioHalo, capaUsuario];
  }, [registros, ubicacion]);

  const zoom = (delta) =>
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom + delta)),
      transitionDuration: 250,
    }));

  const reset = () => {
    setViewState({ ...INITIAL_VIEW_STATE, transitionDuration: 600 });
    onReset?.();
  };

  const localizando = estadoUbicacion === 'loading';

  return (
    <div className="mapa">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: siguiente }) => setViewState(siguiente)}
        controller={true}
        layers={layers}
        className="mapa__deck"
      >
        <Map mapStyle={MAP_STYLE} attributionControl={false} />
      </DeckGL>

      {hover && (
        <Tooltip
          registro={hover.registro}
          x={hover.x}
          y={hover.y}
        />
      )}

      <div className="mapa__controles" role="group" aria-label="Controles del mapa">
        <button
          type="button"
          className="mapa__boton"
          onClick={() => zoom(1)}
          title="Acercar"
          aria-label="Acercar"
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          className="mapa__boton"
          onClick={() => zoom(-1)}
          title="Alejar"
          aria-label="Alejar"
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          className="mapa__boton"
          onClick={reset}
          title="Vista general"
          aria-label="Vista general"
        >
          <RotateCcw size={17} />
        </button>
        <button
          type="button"
          className={`mapa__boton mapa__boton--ubicacion ${localizando ? 'is-loading' : ''}`}
          onClick={onMiUbicacion}
          title="Mi ubicación"
          aria-label="Mi ubicación"
          disabled={localizando}
        >
          {localizando ? <MapPin size={17} /> : <Crosshair size={18} />}
        </button>
      </div>

      {registros.length === 0 && (
        <div className="mapa__vacio">
          <MapPin size={20} />
          <span>Sin resultados para los filtros seleccionados.</span>
        </div>
      )}

      <p className="mapa__atribucion">
        © <a href="https://www.openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> ©{' '}
        <a href="https://www.carto.com/" target="_blank" rel="noreferrer">CARTO</a> · OpenStreetMap contributors
      </p>
    </div>
  );
}
