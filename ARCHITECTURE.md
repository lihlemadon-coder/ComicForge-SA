# ComicForge SA — Architecture

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript (ES6+; no build step, no frameworks)
- No backend, no database server, no AI API

## File Structure
```
ComicForge-SA/
├── index.html
├── manifest.json
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── read-mode.css
│   ├── print.css
│   └── mobile.css
├── js/
│   ├── storage.js
│   ├── models.js
│   ├── story-engine.js
│   ├── character-engine.js
│   ├── comic-builder.js
│   ├── anime-adapter.js
│   ├── ui.js
│   └── app.js
├── assets/
│   ├── icons/
│   ├── placeholders/
│   └── sample-data.json
└── README.md
```

## Data Model (JSON)
Story, Character, Episode, ComicPage, Panel, AnimeShot structures. Add `language` field (default: `zul`) to Story and Episode for isiZulu/English handling.

## Storage
- `localStorage` keyed by project ID.
- Export/Import `.json` project bundles.
- No IndexedDB in v1.

## Hosting
- GitHub Pages or Netlify (static, free, offline-capable).