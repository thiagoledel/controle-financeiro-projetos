import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuração do Vite: aliás para o pacote shared e proxy para a API em desenvolvimento.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@controle-financeiro/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 5173,
    // Necessário para expor o dev server fora do container Docker (0.0.0.0 aceita conexões externas).
    host: '0.0.0.0',
    proxy: {
      // VITE_API_TARGET permite sobrescrever o alvo via env:
      //   - Docker dev: http://api:3001 (nome do serviço na rede interna)
      //   - Local sem Docker: http://localhost:3001 (padrão)
      '/api': {
        target: process.env.VITE_API_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
