# OpenKrisp website

The product website for the OpenKrisp desktop app. The design uses the desktop app’s original forest and mint palette, system typography, wordmark, and audio-flow illustrations.

## Develop

Requires Node.js 24. No package installation or third-party runtime dependencies are needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Set `PORT` to use a different port.

```sh
npm run check
npm test
npm run build
npm run preview
```

The production output is `dist/`. The local preview server is for development only.

## Deploy

Production is hosted on Vercel at [openkrisp.com](https://openkrisp.com/), with
`www.openkrisp.com` redirecting to the primary domain. The Vercel project is
`openkrisp-website` in the domain-owning team.

`vercel.json` selects the Other framework preset, runs `npm run check && npm run build`,
and serves only `dist/`. Node.js 24 is pinned in `package.json`. No environment
variables or server functions are needed. For a direct deployment, run
`npx vercel link` to select this project, then `npx vercel --prod`.

`OpenKrisp/website` is public and linked to Vercel. Pushes to `main` automatically
deploy production; other branches and pull requests receive preview deployments.

`.vercel/` contains local project linkage and is ignored. `.openai/hosting.json`
retains the earlier private Sites preview identity; Vercel does not use it.

## Content and behavior

- The app preview is illustrative. Its two controls work independently and do not request microphone access, record, or process audio.
- Product details, setup instructions, compatibility, and license language are based on the desktop app’s README and source.
- Downloads are pinned to `v0.1.0-beta.4`. Update the release labels in `locales/*.json`, the three package links in `index.html`, and the matching source, checksum, and release-notes destinations in `scripts/render.mjs` together when a new validated release is ready.
- The app repository and published releases are public. The beta installers remain experimental.
- App source and beta.4 downloads are licensed under GNU GPLv3 only (`GPL-3.0-only`). Matching source and checksums are linked beside the installers. Releases before beta.4 retain their original bundled terms.
- The original app icon and SVG illustrations come from the first-party `OpenKrisp/OpenKrisp` desktop project. No fonts, trackers, or assets load from third-party servers.

## Design

Brand colors: forest `#08110f`, surface `#0f1f1b`, text `#effcf8`, muted `#a8bbb5`, mint `#63d9b3`, borders `#29473c`. Typography follows the app’s system sans-serif stack with its rounded wordmark.

Shared typography tokens in `styles.css` define 12px metadata, 14px controls and supporting text, 16px body copy, 20px component titles, and a 24px subsection title. Hero and section headings scale fluidly with the viewport. Keep components on this scale and adapt their layout instead of shrinking labels on mobile; line-height tokens preserve the same reading rhythm throughout.

The page leads with privacy and an interactive recreation of the real two-panel desktop app. A dedicated section shows the boundary of local noise reduction and highlights that current app source is fully open source under GNU GPLv3 only, with repository and license links. Supporting sections explain independent audio paths, connection steps, and beta requirements. Mobile stacks the two panels without shrinking their controls. Keyboard focus, native disclosure elements, a modal help dialog, and reduced-motion preferences are supported.

## Languages

The website supports English (`en`), Spanish (`es`), Brazilian Portuguese (`pt-BR`),
French (`fr`), and German (`de`), matching the desktop app. All visitor-facing
messages are centralized in `locales/<code>.json`; `en.json` defines the keys and
provides the fallback for missing or blank translations. Brand names, package
extensions, and the exact audio device names **OpenKrisp Microphone** and
**OpenKrisp Speaker** stay unchanged. Illustrations have empty alt text because
adjacent translated audio-flow labels convey their meaning; the preview and
privacy diagram have translated accessible descriptions.

See [the language and tone guide](docs/localization.md) for regional wording,
editorial review criteria, and the distinction between technical validation and
native-language review.

`index.html` is a shared template. `scripts/render.mjs` safely escapes messages,
supports line breaks with `\n`, and renders named slots such as `{microphone}` and
`{license}` with fixed semantic markup and destinations. Translate whole sentences
and reorder slots as needed. Keep the same slot names; do not put HTML in catalogs.
The app preview reads its translated dynamic labels from the generated HTML.

`npm run build` generates complete, readable HTML under `/en/`, `/es/`, `/pt-BR/`,
`/fr/`, and `/de/`, plus a sitemap and robots file. Each page includes a localized
title, description, Open Graph metadata, self-canonical URL, and reciprocal
hreflang links, with `/` as `x-default`. Vercel keeps trailing slashes to match
these URLs. No client rendering is required to read or index localized content.

At `/` (or `/index.html`), JavaScript chooses the saved `openkrisp.language`
preference, then the first supported browser language, then English. Regional
variants match their base language; Portuguese variants use Brazilian Portuguese.
Explicit localized URLs always respect their language, so shared links and search
results stay predictable. The picker matches the desktop app: a compact globe,
native language name and chevron over a native select, with a screen-reader label
and current-language description. Its menu retains full native names, including
Português (Brasil). “System default” saves `system` and follows the browser language.
Only manual selections are saved. Switching preserves
the path, query string, and fragment, including the current section. Storage
failures do not prevent navigation. Without JavaScript the entry page is English
and language links remain available below the selector.

To add another language:

1. Add its code, native name, and Open Graph locale to `languages` in `i18n.js`.
2. Copy `locales/en.json` to `locales/<code>.json` and translate every value,
   preserving keys, named slots, brands, and device names.
3. Run `npm run check`, `npm test`, and `npm run build`. Tests require complete
   catalogs and matching slots; English fallback still protects runtime rendering.
4. Check the new page on desktop and mobile, including the selector, both preview
   controls in both states, help dialog, expanded setup instructions and FAQs,
   downloads, and keyboard navigation. Let labels wrap instead of shrinking type.

The build, local server, selector, sitemap, and alternate links use the same
language registry, so no separate routing or SEO lists need updating. The GitHub
Actions workflow runs syntax, localization/behavior tests, and the production build.
