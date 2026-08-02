import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Static output: the whole site is HTML/CSS/images served straight from the
// Cloudflare Pages CDN. No adapter, no Worker, nothing to fall over. If a
// server route is ever needed, add @astrojs/cloudflare then — not before.
export default defineConfig({
  site: 'https://tegaandhenry.com',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap({ lastmod: new Date() }),
  ],
});
