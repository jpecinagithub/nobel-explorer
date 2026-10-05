# Nobel Explorer 🏅

**Discover every Nobel Prize laureate since 1901.**

A lightweight, bilingual (EN/ES) discovery portal — not an encyclopedia. Nobel Explorer keeps only a compact laureate index locally and loads biographies on demand from Wikipedia/Wikimedia inside an internal reader.

## How it works

```
Nobel Explorer
  ├── Small Nobel index (1,018 laureates, 1901–2025)
  ├── Search + filters
  └── Wikipedia Reader ──► Wikimedia APIs
```

- **Data:** laureate names, award years, categories, motivations and topics come from the official Nobel Prize API (`api.nobelprize.org`).
- **Biographies:** fetched live from Wikipedia via the public MediaWiki APIs (EN/ES with automatic fallback), sanitized and rendered in-app. Cached 24h in the browser.
- **Images:** portrait thumbnails hotlinked from Wikimedia Commons with attribution.

## Features

- Instant fuzzy search with natural queries (`physics 1921`, `literatura 1982`, `quantum`, `ADN`)
- Command-style autocomplete (↑↓ / Enter / Esc)
- Filters: category, year range, decade, country, people/organizations — reflected in the URL
- Laureate pages + slide-over Wikipedia reader (fullscreen on mobile)
- Year explorer (1901 → 2025), six category pages, Nobel history, Alfred Nobel profile
- Statistics dashboard (Recharts), curated discover collections, random laureate, recently viewed
- PWA (installable, offline app shell), responsive, WCAG-aware
- Vercel Analytics + Speed Insights, SEO (per-route meta, sitemap, robots)

## Tech

Vite + React 19 + TypeScript + Tailwind CSS 4 · react-router · react-i18next · Fuse.js · Recharts · DOMPurify · vite-plugin-pwa. No backend, no database, no accounts.

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + sitemap + production build
```

The laureate index (`src/data/laureates.json`) was generated from the Nobel Prize API; re-run the generator after new prize announcements.

## Deploy

Static build (`dist/`). On Vercel, `vercel.json` rewrites keep nested routes working after refresh. Enable **Web Analytics** and **Speed Insights** in the Vercel dashboard.

## License & attribution

Independent educational project — **not affiliated with the Nobel Foundation**.
Biographical content © Wikipedia contributors (CC BY-SA). Prize data via nobelprize.org.

Created by [Jon Peciña](https://github.com/jpecinagithub) · jpecina@gmail.com
