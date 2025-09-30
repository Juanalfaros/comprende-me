// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.comprende.me',
  output: 'server',
  adapter: netlify(),
});