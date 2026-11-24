import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.svg', 'favicon.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-512x512-maskable.png'],
        workbox: {
          navigateFallbackDenylist: [/^\/__/]
        },
        manifest: {
          name: 'Pace Manager',
          short_name: 'Pace',
          description: 'Define the speed of life with Pace Manager',
          theme_color: '#121614',
          background_color: '#121614',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }
      })
    ],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('framer-motion')) return 'vendor-motion';
              if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react')) return 'vendor-react';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('canvas-confetti') || id.includes('lenis')) return 'vendor-effects';
            }
          }
        }
      }
    },
    server: {
      proxy: {
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, ''),
          headers: {
            Authorization: `Bearer ${env.VITE_GROQ_API_KEY}`
          }
        }
      }
    }
  }
})
