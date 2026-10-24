// Shared by the static renderer and the browser. No runtime dependencies.
export const languages = [
  { code: 'en', name: 'English', socialLocale: 'en_US' },
  { code: 'es', name: 'Español', socialLocale: 'es_ES' },
  { code: 'pt-BR', name: 'Português (Brasil)', socialLocale: 'pt_BR' },
  { code: 'fr', name: 'Français', socialLocale: 'fr_FR' },
  { code: 'de', name: 'Deutsch', socialLocale: 'de_DE' },
];

export const preferenceKey = 'openkrisp.language';

export function matchLanguage(value) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.toLowerCase();
  return languages.find(language => language.code.toLowerCase() === normalized)?.code
    ?? languages.find(language => language.code.split('-')[0] === normalized.split('-')[0])?.code;
}

export function chooseLanguage(saved, browserLanguages = []) {
  return matchLanguage(saved) ?? browserLanguages.map(matchLanguage).find(Boolean) ?? 'en';
}

export function pathLanguage(pathname) {
  return languages.find(language => language.code === pathname.split('/')[1])?.code;
}

export function localizedUrl(input, locale) {
  if (!languages.some(language => language.code === locale)) throw new Error('Unsupported locale');
  const url = new URL(input);
  const current = pathLanguage(url.pathname);
  let page = current ? url.pathname.slice(current.length + 1) : url.pathname;
  if (page === '/index.html') page = '/';
  url.pathname = `/${locale}${page.startsWith('/') ? page : `/${page}`}`;
  return url;
}

export function initializeLanguage(environment = globalThis) {
  const { window, navigator, document } = environment;
  // Explicit localized URLs are shareable and never redirected by preferences.
  if (!pathLanguage(window.location.pathname)) {
    let saved;
    try { saved = window.localStorage.getItem(preferenceKey); } catch { /* Storage may be disabled. */ }
    const locale = chooseLanguage(saved, navigator.languages?.length ? navigator.languages : [navigator.language]);
    window.location.replace(localizedUrl(window.location.href, locale));
    return;
  }

  const selector = document.querySelector('#language');
  selector?.addEventListener('change', () => {
    const locale = selector.value;
    try { window.localStorage.setItem(preferenceKey, locale); } catch { /* Selection still works. */ }
    window.location.assign(localizedUrl(window.location.href, locale));
  });
}
