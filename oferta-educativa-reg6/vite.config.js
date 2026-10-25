import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // deck.gl + maplibre-gl viven en un chunk aparte que se carga bajo demanda
    // (React.lazy en App.jsx) y pesa ~1.7 MB (≈470 kB gzip).
    chunkSizeWarningLimit: 2000,
  },
});
