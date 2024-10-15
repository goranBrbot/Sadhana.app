import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true, // Omogućuje serviceWorker u razvoju
      },
      strategies: "generateSW",
      manifest: {
        name: "Yoga In Daily Life Sadhana",
        short_name: "Sadhana",
        description: "Sadhana is an application created for the purpose of easy and complete access to the necessary information for regular yoga sadhana.",
        display: "standalone",
        orientation: "portrait",
        theme_color: "rgb(253, 250, 237)",
        background_color: "rgb(253, 250, 237)",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\//,
              handler: "NetworkFirst",
              options: {
                cacheName: "osm-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/swaryog\.sanatankultura\.com\//,
              handler: "NetworkFirst",
              options: {
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      },

      selfDestroying: false,
      events: [
        {
          event: "push",
          handler: async function (event) {
            const data = event.data.json();
            const options = {
              body: data.body || "Default body",
              icon: "/favicon.ico",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "swara",
              requireInteraction: true, // Ostavlja notifikaciju dok korisnik ne reagira
            };
            event.waitUntil(self.registration.showNotification("Day starts with ..", options));
          },
        },
      ],
    }),
  ],
  build: {
    terserOptions: {
      compress: {
        drop_console: true, // This removes all console.log() in production
      },
    },
  },
});
