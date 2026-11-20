# Teko Studio — Live Showroom

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide and Recharts. An interactive prototype using Teko artwork from the supplied Desktop presentation.

## Run locally

Requires Node.js 20.9 or newer (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To use a different port: `npx next dev --hostname 127.0.0.1 --port 3001`.

## Checks

```sh
npm run typecheck
npm run build
```

## Deploy on Vercel

Import `rlgbt1/teko-live-showroom` into Vercel after committing and pushing this source. Select the Next.js preset and the repository root. Use `npm run build`; leave output-directory overrides unset. No environment variables are needed for this prototype. Alternatively, run the Vercel CLI from this directory after signing in.

## Experiences

- `/`: responsive landing page, solution filters and search, expandable industry applications, and contact through the email supplied in Teko's presentation.
- `/demos/business-intelligence`: period filters, consistent fictional revenue/expense/profit/order data, interactive charts, category breakdown and CSV export.
- `/demos/commercial-hub`: editable pipeline stages, customer search/database, recalculated metrics and a rule-based Portuguese assistant using the current pipeline.
- `/demos/project-management`: project progress, task states and filters, activity log, risk identification and a rule-based Portuguese assistant using current tasks.
- `/demos/ai-translator`: guided Portuguese–English phrase translation, direction switching and clipboard copy. Unsupported free text explicitly explains the limitation.

All company records are fictional. The demo reference date is 20 November 2026. AI assistants are explicitly labelled local simulations. No information is sent to AI services. Changes reset on remount or refresh; no database, authentication or persistence is configured.

## Next iteration

Connect authenticated business data, replace local assistant rules and phrase translations with server-side AI integrations, add persistent workspaces and expand localisation. Keep service credentials server-side, and add access controls before connecting confidential information.

## Brand sources

`public/assets/teko-mark.png`: original image embedded in `Teko Presentation.pptx`.
`public/assets/operations.png`: original `Desktop/Teko/1.png`.
Contact email comes from the supplied presentation. Apollo was used as an information-hierarchy reference; the implementation and design are original.

## Browser regression checks

With the local server running, run `npm run test:e2e`. Tests use installed Google Chrome on macOS; elsewhere install Playwright Chromium with `npx playwright install chromium`. You can override the browser using `PLAYWRIGHT_CHROMIUM_EXECUTABLE` and the server using `PLAYWRIGHT_BASE_URL`.

Social metadata uses Vercel's deployment hostname automatically. Set optional `NEXT_PUBLIC_SITE_URL` to your final custom-domain URL when configured.
