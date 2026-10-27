# CLAUDE.md

Ugur Labs landing page (ugur-labs.com). Next.js 16 App Router + Tailwind v4 + lucide-react. Code comments Turkish.

- **Static export only** (`output: 'export'`, `images.unoptimized`) for GitHub Pages: no server features (API routes, Server Actions, cookies, rewrites, `next/image` optimization).
- Deploy: push to `main` → `.github/workflows/deploy.yml` builds `out/` and publishes. `public/CNAME` = custom domain; keep it.
- **i18n:** `/` = TR, `/en/` = EN; both render `src/components/Home.tsx` with a `lang` prop. All UI text lives in `src/i18n/dictionary.ts` (`tr` is the source, `en: typeof tr`).
- **Theme:** `.dark` on `<html>`, set before paint by the inline script in `layout.tsx` (localStorage `theme`, else system) and toggled by `ThemeToggle`. Color tokens (`background`, `surface`, `foreground`, `muted`, `line`, `accent`, `accent-foreground`) are CSS vars in `globals.css` with `.dark` overrides. The palette is monochrome; `accent` (electric blue) is only for buttons/CTAs and selected or hovered interactive states — never decorative text, icons or eyebrows. Semantic colors (e.g. green "live" dot) are fine.
- **Add a project:** append an object to `src/data/projects.ts` (`title`, `description: { tr, en }`, `link`, optional `tags`, `status`).
- **`public/tik-sayaci/index.html` is generated** from `../Tik Sayaci/index.html` by `node ../"Tik Sayaci"/siteye-aktar.mjs`; don't edit it here. Served as a plain static page at `/tik-sayaci/`.
- **Case study** (small "Vaka çalışması · Mimari" link under a project row that opens a native `<dialog>`): set `caseStudy: "<id>"` on the project, add its TR/EN texts to `src/data/case-studies.ts` and an SVG diagram component to `src/components/case-study/` (register it in `diagrams` in `CaseStudyDialog.tsx`). Diagrams use theme classes (`fill-surface`, `stroke-line`, `stroke-muted`…) so they follow light/dark; boxes are clickable and share the selected part with the tabs and the 3 "layers" cards (`layers` in the data). In TR text, write English words that get CSS `uppercase` in capitals (`DOMAIN`), otherwise Turkish casing renders "DOMAİN".
- **Useful links** (bottom section): edit `src/data/links.ts`.
- Commands: `npm run dev`, `npm run build` (output in `out/`), `npm run lint`.

@AGENTS.md
