import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { languages } from '../i18n.js';
import { renderPage, renderSitemap, origin } from './render.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const html = await renderPage('en');
const references = [...html.matchAll(/(?:src|href)="\/([^"#]+)"/g)].map(match => match[1]).filter(reference => !reference.endsWith('/'));
await Promise.all([...new Set(references)].map(reference => access(path.join(root, reference))));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ['styles.css', 'app.js', 'i18n.js', 'assets']) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
await writeFile(path.join(output, 'index.html'), html);
for (const { code } of languages) {
  await mkdir(path.join(output, code));
  await writeFile(path.join(output, code, 'index.html'), await renderPage(code));
}
await writeFile(path.join(output, 'sitemap.xml'), renderSitemap());
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log('Built OpenKrisp website → dist/');
