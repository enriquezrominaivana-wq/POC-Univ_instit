import { useCallback, useState } from 'react';

const MENSAJES = {
  1: 'Permiso de ubicación denegado. Activalo en tu navegador para usar el mapa.',
  2: 'No se pudo obtener tu ubicación (posición no disponible).',
  3: 'Se agotó el tiempo de espera al buscar tu ubicación.',
};

/**
 * Geolocalización HTML5 (navigator.geolocation) con manejo de
 * permisos, carga y errores.
 */
export function useUserLocation() {
  const [estado, setEstado] = useState({
    status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
    coords: null,
    error: null,
  });

  const solicitar = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setEstado({
        status: 'error',
        coords: null,
        error: 'Tu navegador no soporta geolocalización.',
      });
      return;
    }

    setEstado((prev) => ({ ...prev, status: 'loading', error: null }));

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setEstado({
          status: 'ready',
          coords: {
            latitude: posicion.coords.latitude,
            longitude: posicion.coords.longitude,
            accuracy: posicion.coords.accuracy ?? null,
          },
          error: null,
        });
      },
      (error) => {
        setEstado({
          status: 'error',
          coords: null,
          error: MENSAJES[error.code] || 'No se pudo determinar tu ubicación.',
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const limpiar = useCallback(() => {
    setEstado({ status: 'idle', coords: null, error: null });
  }, []);

  return { ...estado, solicitar, limpiar };
}
