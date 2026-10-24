import { readFile } from 'node:fs/promises';
import { languages } from '../i18n.js';

export const origin = 'https://openkrisp.com';
const project = new URL('../', import.meta.url);
export const catalogs = Object.fromEntries(await Promise.all(languages.map(async ({ code }) =>
  [code, JSON.parse(await readFile(new URL(`locales/${code}.json`, project), 'utf8'))]
)));

export function translate(locale, key) {
  const localized = catalogs[locale]?.[key];
  const value = typeof localized === 'string' && localized.trim() ? localized : catalogs.en[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing translation: ${locale}:${key}`);
  return value;
}

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

const release = 'https://github.com/OpenKrisp/OpenKrisp/releases';
const repository = 'https://github.com/OpenKrisp/OpenKrisp';
// Translators can reorder named slots, but cannot add HTML or change URLs.
export const slots = {
  microphone: { text: 'OpenKrisp Microphone', tag: 'strong' },
  speaker: { text: 'OpenKrisp Speaker', tag: 'strong' },
  source: { key: 'links.source', href: `${release}/download/v0.1.0-beta.4/OpenKrisp-0.1.0-beta.4-source.tar.gz` },
  checksums: { key: 'links.checksums', href: `${release}/download/v0.1.0-beta.4/SHA256SUMS` },
  releaseNotes: { key: 'links.releaseNotes', href: `${release}/tag/v0.1.0-beta.4` },
  githubHelp: { key: 'links.githubHelp', href: `${repository}/issues` },
  license: { key: 'links.license', href: `${repository}/blob/main/LICENSE` },
  contributing: { key: 'links.contributing', href: `${repository}/blob/main/CONTRIBUTING.md` },
};

export function renderMessage(locale, key) {
  // Keep a whitespace text node when responsive CSS hides a deliberate break.
  return escapeHtml(translate(locale, key)).replace(/\n/g, '<br>\n').replace(/\{(\w+)\}/g, (_, name) => {
    const slot = slots[name];
    if (!slot) throw new Error(`Unknown message slot: ${name}`);
    const text = escapeHtml(slot.text ?? translate(locale, slot.key));
    return slot.href ? `<a href="${slot.href}">${text}</a>` : `<${slot.tag}>${text}</${slot.tag}>`;
  });
}

export async function renderPage(locale = 'en') {
  const language = languages.find(language => language.code === locale);
  if (!language) throw new Error(`Unsupported locale: ${locale}`);
  const template = await readFile(new URL('index.html', project), 'utf8');
  const data = {
    locale,
    canonical: `${origin}/${locale}/`,
    socialLocale: language.socialLocale,
    alternates: [...languages.map(({ code }) => `<link rel="alternate" hreflang="${code}" href="${origin}/${code}/">`),
      `<link rel="alternate" hreflang="x-default" href="${origin}/">`].join('\n    '),
    socialAlternates: languages.filter(({ code }) => code !== locale).map(({ socialLocale }) =>
      `<meta property="og:locale:alternate" content="${socialLocale}">`).join('\n    '),
    languageOptions: languages.map(({ code, name }) =>
      `<option value="${code}" lang="${code}"${code === locale ? ' selected' : ''}>${name}</option>`).join(''),
    languageLinks: languages.map(({ code, name }) =>
      `<a href="/${code}/" lang="${code}" hreflang="${code}"${code === locale ? ' aria-current="page"' : ''}>${name}</a>`).join(' '),
  };
  return template.replace(/\{\{([\w.]+)\}\}/g, (_, key) => data[key] ?? renderMessage(locale, key));
}

export function renderSitemap() {
  const alternates = languages.map(({ code }) =>
    `    <xhtml:link rel="alternate" hreflang="${code}" href="${origin}/${code}/"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${languages.map(({ code }) => `  <url>
    <loc>${origin}/${code}/</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/"/>
  </url>`).join('\n')}
</urlset>\n`;
}
