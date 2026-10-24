import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isPreview }) => ({
  plugins: [react()],
  // Dev uses SPA fallback; `vite preview` serves the prerendered files like a static host would.
  appType: isPreview ? 'mpa' : 'spa',
  ssr: {
    // Bundle these into the server build so the prerender script runs without extra resolution.
    noExternal: ['motion', 'lucide-react'],
  },
}));
