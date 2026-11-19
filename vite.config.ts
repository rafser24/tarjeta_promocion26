import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// VITE_SITE_URL (p. ej. https://promocion2026.vercel.app) se usa para las URL absolutas de la vista previa
// al compartir (Open Graph). WhatsApp/Facebook exigen URL absoluta para mostrar la imagen.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '')
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      { name: 'site-url', transformIndexHtml: (html: string) => html.replace(/__SITE_URL__/g, site) },
    ],
  }
})
