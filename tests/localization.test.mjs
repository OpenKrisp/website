import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { languages, chooseLanguage, pathLanguage, localizedUrl, initializeLanguage, preferenceKey } from '../i18n.js';
import { catalogs, translate, renderPage, renderMessage, renderSitemap } from '../scripts/render.mjs';

test('saved preference, supported browser language, then English; regional matching', () => {
  assert.equal(chooseLanguage('de', ['es-AR']), 'de');
  assert.equal(chooseLanguage('invalid', ['ja', 'es-AR', 'fr']), 'es');
  assert.equal(chooseLanguage(null, ['pt-PT']), 'pt-BR');
  assert.equal(chooseLanguage(null, ['PT-br']), 'pt-BR');
  assert.equal(chooseLanguage(null, ['fr-CA']), 'fr');
  assert.equal(chooseLanguage(null, ['de-AT']), 'de');
  assert.equal(chooseLanguage(null, ['en-GB', 'fr']), 'en');
  assert.equal(chooseLanguage(null, ['ja', 'zh-CN']), 'en');
  assert.equal(chooseLanguage(null), 'en');
  assert.equal(chooseLanguage('system', ['pt-BR']), 'pt-BR');
});

test('switching preserves page, query and anchor, including future nested pages', () => {
  for (const { code } of languages) {
    assert.equal(localizedUrl('https://openkrisp.com/es/?campaign=beta#download', code).href,
      `https://openkrisp.com/${code}/?campaign=beta#download`);
    assert.equal(localizedUrl('https://openkrisp.com/fr/guide/audio/?a=1#setup', code).pathname,
      `/${code}/guide/audio/`);
    assert.equal(localizedUrl('https://openkrisp.com/index.html#privacy', code).href,
      `https://openkrisp.com/${code}/#privacy`);
  }
  assert.equal(pathLanguage('/pt-BR/'), 'pt-BR');
  assert.equal(pathLanguage('/unsupported/'), undefined);
  assert.throws(() => localizedUrl('https://openkrisp.com/', 'xx'));
});

function browserEnvironment({ path = '/', saved, blocked = false, browser = ['fr-CA'] } = {}) {
  const calls = {};
  const selector = { value: 'de', addEventListener: (event, callback) => { calls[event] = callback; } };
  return {
    calls, selector,
    window: {
      location: { pathname: path, href: `https://openkrisp.com${path}?campaign=beta#download`,
        replace: url => { calls.replace = url.href; }, assign: url => { calls.assign = url.href; } },
      localStorage: { getItem: key => { assert.equal(key, preferenceKey); if (blocked) throw Error('blocked'); return saved; },
        setItem: (key, value) => { if (blocked) throw Error('blocked'); calls.saved = [key, value]; } },
    },
    navigator: { languages: browser, language: browser[0] },
    document: { querySelector: () => selector },
  };
}

test('entry negotiation and manual selection work with storage denied; explicit URLs stay put', () => {
  const saved = browserEnvironment({ saved: 'es' });
  initializeLanguage(saved);
  assert.equal(saved.calls.replace, 'https://openkrisp.com/es/?campaign=beta#download');
  const blocked = browserEnvironment({ blocked: true });
  initializeLanguage(blocked);
  assert.equal(blocked.calls.replace, 'https://openkrisp.com/fr/?campaign=beta#download');
  const explicit = browserEnvironment({ path: '/pt-BR/', saved: 'es' });
  initializeLanguage(explicit);
  assert.equal(explicit.calls.replace, undefined);
  explicit.selector.value = 'de';
  explicit.calls.change();
  assert.deepEqual(explicit.calls.saved, [preferenceKey, 'de']);
  assert.equal(explicit.calls.assign, 'https://openkrisp.com/de/?campaign=beta#download');
  const denied = browserEnvironment({ path: '/en/', blocked: true });
  initializeLanguage(denied);
  denied.selector.value = 'de';
  denied.calls.change();
  assert.equal(denied.calls.assign, 'https://openkrisp.com/de/?campaign=beta#download');
});

test('desktop-style System default follows browser language and respects shared URLs', () => {
  const automatic = browserEnvironment({ path: '/fr/', saved: 'system' });
  initializeLanguage(automatic);
  assert.equal(automatic.selector.value, 'system');
  const explicit = browserEnvironment({ path: '/de/', saved: 'system' });
  initializeLanguage(explicit);
  assert.equal(explicit.selector.value, 'de');
  assert.equal(explicit.calls.replace, undefined);
  explicit.selector.value = 'system';
  explicit.calls.change();
  assert.deepEqual(explicit.calls.saved, [preferenceKey, 'system']);
  assert.equal(explicit.calls.assign, 'https://openkrisp.com/fr/?campaign=beta#download');
  const denied = browserEnvironment({ path: '/de/', blocked: true });
  initializeLanguage(denied);
  denied.selector.value = 'system';
  denied.calls.change();
  assert.equal(denied.calls.assign, 'https://openkrisp.com/fr/?campaign=beta#download');
});

const placeholders = message => [...message.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
for (const { code, name, socialLocale } of languages) {
  test(`${code}: complete catalog, matching slots, translated interactive states and static SEO`, async () => {
    assert.deepEqual(Object.keys(catalogs[code]).sort(), Object.keys(catalogs.en).sort());
    for (const [key, english] of Object.entries(catalogs.en)) {
      assert.ok(catalogs[code][key]?.trim(), `${code}:${key}`);
      assert.deepEqual(placeholders(catalogs[code][key]), placeholders(english), `${code}:${key} slots`);
      assert.doesNotMatch(catalogs[code][key], /[<>]/, `${code}:${key} contains markup`);
    }
    const html = await renderPage(code);
    assert.ok(html.includes(`<html lang="${code}">`));
    assert.ok(html.includes(`<link rel="canonical" href="https://openkrisp.com/${code}/">`));
    assert.ok(html.includes(`<meta property="og:url" content="https://openkrisp.com/${code}/">`));
    assert.ok(html.includes(`<meta property="og:locale" content="${socialLocale}">`));
    assert.ok(html.includes(`<option value="${code}" lang="${code}" selected>${name}</option>`));
    assert.ok(html.includes('aria-describedby="language-current"'));
    assert.ok(html.includes(`<option value="system">${catalogs[code]['language.system']}</option>`));
    for (const { code: alternate } of languages) {
      assert.ok(html.includes(`hreflang="${alternate}" href="https://openkrisp.com/${alternate}/"`));
    }
    assert.ok(html.includes('hreflang="x-default" href="https://openkrisp.com/"'));
    for (const key of ['status.off', 'common.turnOn', 'microphone.turnOn', 'speakers.turnOn', 'help.close']) {
      assert.ok(html.includes(renderMessage(code, key)), `${code}:${key} not rendered`);
    }
    assert.doesNotMatch(html, /\{\{?|\.\/assets\//);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.equal([...html.matchAll(/<link rel="canonical"/g)].length, 1);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate IDs');
    for (const [, id] of html.matchAll(/(?:href="#|aria-labelledby=")([^"\s]+)"/g)) {
      if (id) assert.ok(ids.includes(id), `broken anchor: ${id}`);
    }
    // These exact device names must match what users choose in their call apps.
    assert.ok(html.includes('<strong>OpenKrisp Microphone</strong>'));
    assert.ok(html.includes('<strong>OpenKrisp Speaker</strong>'));
  });
}

test('English fallback, escaped messages and allowlisted semantic slots', () => {
  assert.equal(translate('unknown', 'nav.home'), catalogs.en['nav.home']);
  const original = catalogs.de['nav.home'];
  try {
    delete catalogs.de['nav.home'];
    assert.equal(translate('de', 'nav.home'), catalogs.en['nav.home']);
    catalogs.de['nav.home'] = '';
    assert.equal(translate('de', 'nav.home'), catalogs.en['nav.home']);
    catalogs.de['nav.home'] = '<script>"&';
    assert.equal(renderMessage('de', 'nav.home'), '&lt;script&gt;&quot;&amp;');
  } finally { catalogs.de['nav.home'] = original; }
  assert.throws(() => translate('en', 'missing.key'));
  assert.ok(renderMessage('fr', 'setup.connectDescription').includes('<strong>OpenKrisp Microphone</strong>'));
  assert.ok(renderMessage('en', 'faq.title').includes('<br>\nto know.'), 'hidden mobile breaks still separate words');
});

test('sitemap lists each localized URL with reciprocal alternates', () => {
  const sitemap = renderSitemap();
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, languages.length);
  for (const { code } of languages) {
    assert.ok(sitemap.includes(`<loc>https://openkrisp.com/${code}/</loc>`));
    assert.equal(sitemap.split(`hreflang="${code}"`).length - 1, languages.length);
  }
});

test('template leaves only brand names and technical labels outside catalogs', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const allowed = new Set(['OpenKrisp', 'OpenKrisp Microphone', 'OpenKrisp Speaker', 'GitHub', 'Debian / Ubuntu', 'Fedora', '.pkg', '.deb', '.rpm', '1', '2', '3']);
  const texts = [...template.matchAll(/>([^<>]+)</g)].map(match => match[1].replace(/\{\{[\w.]+\}\}/g, '').trim()).filter(Boolean);
  for (const text of texts) assert.ok(allowed.has(text), `Untranslated content: ${text}`);
});
