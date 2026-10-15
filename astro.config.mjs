// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://alessiomartini.github.io',
  base: '/projects-overview',
  trailingSlash: 'ignore',
  integrations: [preact()],
});
