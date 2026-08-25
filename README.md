# Telangana's Secrets

A short field guide to lesser-known places in Telangana, India — inspired by Atlas Obscura.

```
npm install
npm run dev      # dev server with hot reload
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
```

## Where things live

| File | What it does |
| --- | --- |
| [index.html](index.html) | Bare shell — one `<script type="module">` and nothing else |
| [src/main.js](src/main.js) | Builds the page and wires up the interactions |
| [src/data/sites.js](src/data/sites.js) | The places. Edit this to add or change one |
| [src/style.css](src/style.css) | All the styling |
| [src/assets/](src/assets/) | Photos, kept local so the build can optimize them |

## What Vite is doing here

The site is plain HTML, CSS and JavaScript — Vite just removes the chores that
usually come with it:

- **npm packages instead of CDN tags.** `canvas-confetti` and the two
  self-hosted fonts are imported by name in [src/main.js](src/main.js#L1-L6).
  No `<script src="https://...">`, no vendored copies in the repo.
- **Hot module replacement.** With `npm run dev` running, edit a blurb in
  [src/data/sites.js](src/data/sites.js) and the grid re-renders instantly —
  no page reload, and any cards you'd expanded stay expanded.
- **Asset handling.** `import.meta.glob` picks up every photo in
  `src/assets/sites/` at build time, so a site entry only names its file. On
  build, each image (and each font, and the CSS) comes out hashed for
  permanent caching.
- **One bundle at the end.** `npm run build` produces a single ~7 kB gzipped JS
  file and one CSS file, minified, from a dozen source modules.
