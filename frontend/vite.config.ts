import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bốn Năm Thanh Xuân',
        short_name: 'Thanh Xuân',
        theme_color: '#12213a',
        background_color: '#08111f',
        display: 'standalone',
        lang: 'vi',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,webp}'],
        globIgnores: ['**/node_modules/**'],
        additionalManifestEntries: [
          { url: '/icons/icon-192.png', revision: null },
          { url: '/icons/icon-512.png', revision: null },
          { url: '/icons/maskable-192.png', revision: null },
          { url: '/icons/maskable-512.png', revision: null },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/v1': { target: 'http://localhost:8787', changeOrigin: true },
    },
  },
});