import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/test-db': 'http://localhost:3000',
      '/register': 'http://localhost:3000',
      '/decode': 'http://localhost:3000',
    },
    historyApiFallback: true, // Thêm dòng này để xử lý routing phía client
  },
});