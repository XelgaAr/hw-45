import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { normalizeBasePath } from './scripts/base-path.mjs';

export default defineConfig({
  plugins: [react()],
  base: normalizeBasePath(process.env.PAGES_BASE_PATH),
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: { target: 'es2022' },
});
