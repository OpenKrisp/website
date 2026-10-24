import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathLanguage } from '../i18n.js';
import { renderPage, renderSitemap, origin } from './render.mjs';

const project = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const root = process.argv.includes('--dist') ? path.join(project, 'dist') : project;
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'i18n.js', 'sitemap.xml', 'robots.txt']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
const host = '127.0.0.1';

const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    const locale = pathLanguage(pathname);
    if (locale && pathname === `/${locale}`) {
      response.writeHead(308, { Location: `/${locale}/${new URL(request.url, `http://${host}`).search}` });
      response.end();
      return;
    }
    const isPage = pathname === '/' || pathname === '/index.html' || (locale && [ `/${locale}/`, `/${locale}/index.html` ].includes(pathname));
    const relative = isPage ? (locale ? `${locale}/index.html` : 'index.html') : pathname.slice(1);
    const filename = path.resolve(root, relative);
    const isAsset = relative.startsWith('assets/') && path.extname(relative) in types;
    if ((!allowed.has(relative) && !isAsset && !isPage) || !filename.startsWith(root + path.sep)) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    let data;
    if (!process.argv.includes('--dist') && isPage) data = await renderPage(locale ?? 'en');
    else if (!process.argv.includes('--dist') && relative === 'sitemap.xml') data = renderSitemap();
    else if (!process.argv.includes('--dist') && relative === 'robots.txt') data = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
    else {
      const info = await stat(filename);
      if (!info.isFile()) throw new Error('Not a file');
      data = await readFile(filename);
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
server.listen(port, host, () => console.log(`OpenKrisp website: http://${host}:${server.address().port}`));
