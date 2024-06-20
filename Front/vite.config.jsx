
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1234,
    proxy: {
      '/api': 'http://localhost:3000' // ajustez le port si nécessaire
    }
  },
  build: {
    outDir: 'dist', // dossier de sortie pour les fichiers de production
  },
  
  
});

