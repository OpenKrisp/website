# OpenKrisp website

The product website for the OpenKrisp desktop app. The design uses the desktop app’s original forest and mint palette, system typography, wordmark, and audio-flow illustrations.

## Develop

Requires Node.js 22 or later. No package installation or third-party runtime dependencies are needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Set `PORT` to use a different port.

```sh
npm run check
npm run build
npm run preview
```

The production output is `dist/`. Deploy that directory to any static host; relative paths also support a GitHub Pages project subdirectory. The local preview server is for development only. `.openai/hosting.json` connects the private Sites deployment; the GitHub origin remains `OpenKrisp/website`.

## Content and behavior

- The app preview is illustrative. Its two controls work independently and do not request microphone access, record, or process audio.
- Product details, setup instructions, compatibility, and license language are based on the desktop app’s README and source.
- Downloads are pinned to `v0.1.0-beta.3`. Update the release label, three package links, and release-notes link in `index.html` together when a new validated release is ready.
- Repository access is required for downloads during the private beta. The site says so before visitors follow the release links.
- The original app icon and SVG illustrations come from the first-party `OpenKrisp/OpenKrisp` desktop project. No fonts, trackers, or assets load from third-party servers.

## Design

Brand colors: forest `#08110f`, surface `#0f1f1b`, text `#effcf8`, muted `#a8bbb5`, mint `#63d9b3`, borders `#29473c`. Typography follows the app’s system sans-serif stack with its rounded wordmark.

The page leads with privacy and an interactive recreation of the real two-panel desktop app. A dedicated section shows the boundary of local noise reduction and highlights source access with repository and license links. Use “source available” for the current PolyForm Perimeter license; its noncompete restriction does not meet the Open Source Definition. Source access requires repository permission during the private beta. Supporting sections explain independent audio paths, connection steps, and beta requirements. Mobile stacks the two panels without shrinking their controls. Keyboard focus, native disclosure elements, a modal help dialog, and reduced-motion preferences are supported.
