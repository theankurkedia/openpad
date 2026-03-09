# OpenPad

A minimal, open-source web notepad. Notes are stored entirely in the URL query string (`?data=<markdown>&mode=<plain|checkbox>`), so there's no backend or database — sharing a link shares the note.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Lexical** for rich text editing with markdown serialization
- **Workbox** service worker for offline PWA support
- **TinyURL** for shortening share links
- **Vercel Analytics** for page view tracking

## Project Structure

```
src/
├── App.tsx                    # Root component (header + action area + shortcut modal)
├── components/
│   ├── ActionArea.tsx         # State management: editor ref, mode, URL hydration, auto-save
│   ├── Editor.tsx             # Lexical editor with plugins and keyboard shortcuts
│   ├── ActionButtonGroup.tsx  # Mode switcher + Save / Copy link / Clear buttons
│   └── ShortcutModal/        # Cmd+/ help modal (index, Content, Block, Overlay)
├── utils/
│   ├── Editor.ts             # Markdown encode/decode, transformers (incl. CHECK_LIST)
│   ├── url.ts                # TinyURL shortening + clipboard copy
│   └── hooks.ts              # useAutoSave (2-min interval, beforeunload)
├── constants/index.ts         # Keyboard shortcuts definitions
├── types.ts                   # ShortcutType, EditorMode
├── service-worker.ts          # Workbox SW (precache + app shell routing)
└── serviceWorkerRegistration.ts
```

## Key Patterns

- **URL-based persistence**: Content → Markdown string → encodeURIComponent → `?data=` query param. No backend.
- **Two editor modes**: "Text" (rich text) and "Checklist" (todo items with checkboxes). Mode stored in URL as `&mode=plain|checkbox`.
- **Markdown storage**: Content serialized as Markdown (not JSON) for compact URLs. Uses Lexical's `$convertToMarkdownString` / `$convertFromMarkdownString` with `TRANSFORMERS + CHECK_LIST`.
- **Auto-save**: Every 2 minutes, compares current content with URL. Stops after 5 unchanged checks.
- **TinyURL fallback**: If shortening fails, copies the full URL instead.
- **Keyboard shortcuts**: Cmd+B (bold), Cmd+I (italic), Cmd+J (code), Cmd+S (save), Cmd+C (copy link), Cmd+X (clear).
- **Editor architecture**: Lexical plugins — RichTextPlugin, ListPlugin, CheckListPlugin, MarkdownShortcutPlugin, HistoryPlugin, plus custom KeyboardShortcutsPlugin and EditorRefPlugin.

## Commands

- `yarn dev` — Start dev server (port 3000)
- `yarn build` — TypeScript check + Vite production build (outputs to `/dist`)
- `yarn preview` — Preview production build

## Conventions

- Use `yarn` (not npm)
- Dark theme: background `#282c34`, accent blue `#2563eb`
- GPL-3.0 licensed
