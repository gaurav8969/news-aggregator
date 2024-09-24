import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // or any port you're using
  },
  build: {
    rollupOptions: {
      input: './index.html',
      output: {
        // Prevent chunk splitting which can cause issues with dynamic imports
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Optional, only if necessary
  },
});