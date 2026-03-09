# OpenPad

A minimal, shareable notepad that lives entirely in the URL. Write a note, hit copy — the entire note is encoded into a short link. No accounts, no database, no backend.

**https://openpad.ak1.app**

## Features

- Two editor modes: **rich text** and **checklist**
- Rich text editing (bold, italic, code, headings, lists, blockquotes)
- Checklist mode with interactive checkboxes
- Notes stored as Markdown in the URL — sharing a link shares the note
- Markdown shortcuts (type `**bold**`, `# heading`, `- [ ] todo`, etc.)
- Auto-save every 2 minutes
- Short links via TinyURL
- Works offline (PWA with service worker)
- Installable on mobile and desktop

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+B` | Bold |
| `Cmd+I` | Italic |
| `Cmd+J` | Code |
| `Cmd+S` | Save |
| `Cmd+C` | Copy link |
| `Cmd+X` | Clear |
| `Cmd+/` | Show shortcuts |

## Development

```bash
yarn install
yarn dev        # Start dev server on port 3000
yarn build      # Production build
yarn preview    # Preview production build
```

## Tech Stack

React, TypeScript, Vite, Lexical, Workbox

## License

GPL-3.0
