# PocketKB

A pocket-sized IT knowledge base for field technicians and help desk staff. Built as a mobile-first progressive web app with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Search** — Real-time filtering across fix titles, summaries, and tags
- **Browse** — 9 categories with color-coded grid navigation
- **Camera** — Full-screen viewfinder for error screen capture (future OCR)
- **Detail View** — Step-by-step resolution checklists with toggleable completion
- **Dark Theme** — Navy/black backgrounds with cyan accent glow
- **Responsive** — Mobile-first design, adapts to tablet and desktop

## Tech Stack

- React 18 (functional components + hooks)
- Vite 5 (dev server + build)
- Single-file architecture (`src/App.jsx`)
- Inline SVG icons (no icon library dependencies)
- JetBrains Mono + Nunito fonts (Google Fonts)

## Project Structure

```
PocketKB/
├── index.html          # Entry point with font imports
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── src/
    ├── main.jsx        # React DOM mount
    ├── App.jsx         # Entire application (data, components, screens)
    └── index.css       # Design system and responsive styles
```

## Roadmap

- [ ] LocalStorage / IndexedDB persistence for user-created fixes
- [ ] Camera OCR via Tesseract.js for error text extraction
- [ ] Create / edit fix form
- [ ] Pinning and starring fixes
- [ ] Full-text search indexing
- [ ] PWA manifest and service worker for offline use
- [ ] Export / import knowledge base as JSON
