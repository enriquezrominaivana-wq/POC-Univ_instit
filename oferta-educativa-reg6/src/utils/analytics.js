/**
 * Empuja eventos al dataLayer de Google Tag Manager.
 * Wrapper seguro: si el script de GTM no cargó, no rompe la app.
 */
export function pushEvento(evento, datos = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: evento, ...datos });
  } catch {
    /* entorno sin window (SSR/tests) */
  }
}
