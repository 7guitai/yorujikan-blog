// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.new/config
export default defineConfig({
  site: 'https://ripigai.yorujikan-blog.pages.dev',
  integrations: [sitemap(), mdx()],
});
