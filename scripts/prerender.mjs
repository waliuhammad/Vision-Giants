/**
 * Static prerendering: renders every route defined in src/config/seo.ts to its own HTML file,
 * injects per-page head tags, and writes 404.html, sitemap.xml and robots.txt.
 *
 * Runs after `vite build` (client → dist/client) and `vite build --ssr` (server → dist/server).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(root, 'dist/client');
const serverEntry = path.join(root, 'dist/server/entry-server.js');

const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8');
const { render, pages, notFoundMeta, adminMeta, renderHeadTags, SITE_URL, loadContent, isFirebaseConfigured } = await import(
  pathToFileURL(serverEntry).href
);

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('index.html template is missing <!--app-head--> or <!--app-html--> placeholders');
}

// Content managed in the admin dashboard (or the built-in defaults). A Firestore error fails the
// build rather than silently publishing stale content.
const content = await loadContent();
console.log(`  content: ${isFirebaseConfigured ? 'Firestore (or defaults if not imported yet)' : 'built-in defaults'}`);
// The browser hydrates from exactly the content the HTML was rendered with.
const contentScript = `<script>window.__CONTENT__=${JSON.stringify(content).replace(/</g, '\\u003c')}</script>`;

// Function replacers, so `$` sequences in content are never treated as replacement patterns.
const fill = (head, html) => template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
const build = (url, meta) => fill(`${renderHeadTags(meta)}\n    ${contentScript}`, render(url, content));

for (const meta of pages) {
  const outDir = path.join(clientDir, meta.path);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'index.html'), build(meta.path, meta));
  console.log(`  prerendered ${meta.path}`);
}

await fs.writeFile(path.join(clientDir, '404.html'), build('/404', notFoundMeta));
console.log('  prerendered /404.html');

// The admin dashboard renders entirely in the browser; hosting rewrites /admin/** to this shell.
await fs.mkdir(path.join(clientDir, 'admin'), { recursive: true });
await fs.writeFile(path.join(clientDir, 'admin/index.html'), fill(renderHeadTags(adminMeta), ''));
console.log('  wrote /admin/ shell');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await fs.writeFile(path.join(clientDir, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(clientDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`  wrote sitemap.xml and robots.txt (site URL: ${SITE_URL})`);

if (SITE_URL.includes('example.com')) {
  console.warn('\n  ⚠ VITE_SITE_URL is not set: canonical URLs and the sitemap use the placeholder https://www.example.com\n');
}
