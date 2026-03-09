# OpenPad

A minimal, open-source web notepad. Notes are stored entirely in the URL query string (`?data=<encoded>`), so there's no backend or database — sharing a link shares the note.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Draft.js** for rich text editing (legacy, considering migration)
- **Workbox** service worker for offline PWA support
- **TinyURL** for shortening share links

## Project Structure

```
src/
├── App.tsx                    # Root component (header + action area + shortcut modal)
├── components/
│   ├── ActionArea.tsx         # Main state management: editor state, URL hydration, auto-save
│   ├── Editor.tsx             # Draft.js editor with keyboard shortcuts
│   ├── ActionButtonGroup.tsx  # Save / Copy link / Clear buttons
│   └── ShortcutModal/        # Cmd+/ help modal (index, Content, Block, Overlay)
├── utils/
│   ├── Editor.ts             # Encode/decode Draft.js content for URL storage
│   ├── url.ts                # TinyURL shortening + clipboard copy
│   └── hooks.ts              # useAutoSave (2-min interval, beforeunload)
├── constants/index.ts         # Keyboard shortcuts definitions
├── types.ts                   # ShortcutType
├── service-worker.ts          # Workbox SW (precache + app shell routing)
└── serviceWorkerRegistration.ts
```

## Key Patterns

- **URL-based persistence**: Content → JSON → encodeURIComponent → `?data=` query param. No backend.
- **Auto-save**: Every 2 minutes, compares current content with URL. Stops after 5 unchanged checks.
- **TinyURL fallback**: If shortening fails, copies the full URL instead.
- **Keyboard shortcuts**: Cmd+B (bold), Cmd+I (italic), Cmd+J (code), Cmd+S (save), Cmd+C (copy link), Cmd+X (clear).

## Commands

- `yarn dev` — Start dev server (port 3000)
- `yarn build` — TypeScript check + Vite production build (outputs to `/build`)
- `yarn preview` — Preview production build

## Conventions

- Conventional commits enforced via commitlint + husky
- Use `yarn` (not npm)
- Dark theme: background `#282c34`, accent blue `#2563eb`
