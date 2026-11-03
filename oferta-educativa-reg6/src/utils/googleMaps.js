/**
 * URLs para continuar en Google Maps desde el popup del mapa.
 * No requiere API key.
 */

/** Busca la institución por nombre + municipio (muestra su ficha en Google Maps). */
export function urlVerEnGoogleMaps(registro) {
  const consulta = [registro.nombre, registro.municipio_nombre]
    .filter(Boolean)
    .join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/** Indicaciones "cómo llegar" hasta las coordenadas exactas del punto. */
export function urlComoLlegar(registro) {
  const destino = `${registro.latitud},${registro.longitud}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}
