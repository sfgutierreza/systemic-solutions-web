import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const systemicHomepageInDevelopment: Plugin = {
  name: 'systemic-homepage-in-development',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const pathname = request.url?.split('?')[0]
      if (pathname === '/' || pathname === '/index.html') {
        request.url = '/systemic-stitch.html'
      }
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [systemicHomepageInDevelopment, react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code-splitting: evita un único chunk de ~500kB. Mejora el TTI en
    // conexiones móviles de provincia (donde casi todos entran por celular).
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
