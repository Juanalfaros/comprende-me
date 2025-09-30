// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.comprende.me',
  output: 'server', // <-- CAMBIAR 'static' POR 'server'
  adapter: node({   // <-- AÑADIR ESTAS LÍNEAS
    mode: "standalone"
  }),
});