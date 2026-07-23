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
            src: '/icons/icon.svg',
            sizes: '192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/maskable.svg',
            sizes: '192',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
          {
            src: '/icons/maskable-512.svg',
            sizes: '512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,webp}'],
        globIgnores: ['**/node_modules/**'],
        additionalManifestEntries: [
          { url: '/icons/icon.svg', revision: null },
          { url: '/icons/icon-512.svg', revision: null },
          { url: '/icons/maskable.svg', revision: null },
          { url: '/icons/maskable-512.svg', revision: null },
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