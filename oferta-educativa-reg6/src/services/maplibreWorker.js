import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

/**
 * maplibre-gl calcula la URL de su Web Worker a partir de `import.meta.url`.
 * Con Vite eso apunta al bundle optimizado (dev) o al chunk generado (build),
 * donde el worker no existe y la base del mapa no carga.
 *
 * Se fija explícitamente la URL del asset real: en dev el archivo se sirve
 * desde node_modules y en build se copia con hash a dist/assets.
 */
setWorkerUrl(workerUrl);

export default workerUrl;
