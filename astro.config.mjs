// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.comprende.me',
  output: 'server',
  
  // --- CORRECCIÓN AQUÍ ---
  // Añadimos imageCDN: false para desactivar la optimización de imágenes de Netlify
  // y forzar el uso de las imágenes optimizadas que genera Astro.
  adapter: netlify({
    imageCDN: false
  }),

  integrations: [sitemap()],
});