// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.comprende.me',
  output: 'server',
  adapter: netlify(),
  integrations: [sitemap()],
});