import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
    return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        includeAssets: ['icon-192x192.png', 'icon-512x512.png', 'icon.svg'],
        manifest: {
          name: 'AnQuickMerca',
          short_name: 'QuickMerca',
          description: 'Optimiza tu compra en segundos',
          start_url: '/',
          display: 'standalone',
          scope: '/',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#0ea5e9',
          icons: [
            { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000, // Incrementado a 5MB por Three.js
          runtimeCaching: [
            {
              urlPattern: /\/imgs\/.*\.(png|jpg|jpeg|svg|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            },
            {
              urlPattern: /\/public\/.*$/,
              handler: 'NetworkFirst',
              options: { cacheName: 'public-resources' }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
