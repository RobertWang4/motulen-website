import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// GitHub Pages serves the site under /<repo>/ — set BASE_PATH=/motulen-website in CI.
// Templates use root-absolute links (/zh/...), so on a non-root base we rewrite them after build.
const BASE = process.env.BASE_PATH || '/';
const SITE = process.env.SITE_URL || 'https://example.com';

function rewriteBase() {
  return {
    name: 'rewrite-base',
    hooks: {
      'astro:build:done': ({ dir }) => {
        if (BASE === '/') return;
        const prefix = BASE.replace(/\/$/, '');
        const skip = '(?!\\/)(?!' + prefix.slice(1) + '\\/)'; // not protocol-relative, not already prefixed
        const walk = (d) => {
          for (const f of readdirSync(d)) {
            const p = join(d, f);
            if (statSync(p).isDirectory()) walk(p);
            else if (/\.(html|css|js)$/.test(f)) {
              const src = readFileSync(p, 'utf8');
              const out = src
                .replace(new RegExp('(href|src|action|content|poster|srcset)="/' + skip, 'g'), `$1="${prefix}/`)
                .replace(new RegExp('url=/' + skip, 'g'), `url=${prefix}/`)
                .replace(new RegExp("url\\((['\"]?)/" + skip, 'g'), `url($1${prefix}/`)
                .replace(/(["'`])\/img\//g, `$1${prefix}/img/`)
                .replace(new RegExp(SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/(?!' + prefix.slice(1) + '/)', 'g'), SITE + prefix + '/');
              if (out !== src) writeFileSync(p, out);
            }
          }
        };
        walk(dir.pathname);
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // load the next page on hover so the transition starts from a ready document
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Inline CSS into every page. GitHub Pages swaps all hashed assets on each deploy, so a cached
  // or prefetched old page would otherwise request a stylesheet that no longer exists and render unstyled.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap(), rewriteBase()],
  vite: { plugins: [tailwindcss()] },
});
