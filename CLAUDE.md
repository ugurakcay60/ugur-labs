# CLAUDE.md

Ugur Labs landing page (ugur-labs.com). Next.js 16 App Router + Tailwind v4 + lucide-react. UI text English, code comments Turkish.

- **Static export only** (`output: 'export'`, `images.unoptimized`) for GitHub Pages: no server features (API routes, Server Actions, cookies, rewrites, `next/image` optimization).
- Deploy: push to `main` → `.github/workflows/deploy.yml` builds `out/` and publishes. `public/CNAME` = custom domain; keep it.
- **Add a project:** append an object to `src/data/projects.ts` (`title`, `description`, `link`, optional `tags`, `status`). Nothing else to edit.
- Colors are tokens in `src/app/globals.css` (`@theme`): `background`, `surface`, `foreground`, `muted`, `line`, `accent`.
- Commands: `npm run dev`, `npm run build` (output in `out/`), `npm run lint`.

@AGENTS.md
