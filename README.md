# DevHub

DevHub is a responsive developer workspace for browser-local utilities. It is intentionally useful without an account: tool input, favorites, recent tools, and theme preferences remain in the current browser's local storage.

## Implemented

- Dashboard with search, categories, quick access, favorites, recent activity, and responsive navigation
- JSON formatter/validator/minifier
- UTF-8 Base64 encoder/decoder
- Regular expression tester
- Text case converter and word/character counts
- URL component encoder/decoder
- Cryptographically random UUID generator
- Web Crypto SHA-256, SHA-384, and SHA-512 hashing
- Sandboxed HTML/CSS/JavaScript live playground
- CSV ↔ JSON conversion with quoted-field parsing and custom delimiters
- Unix timestamp and ISO date conversion with UTC/local displays
- YAML validation/formatting and JSON conversion
- HEX/RGB/HSL color conversion and WCAG contrast ratios
- XML formatter/validator, Markdown preview, SQL formatter
- HTTP status reference and cron schedule toolkit
- Dark/light theme preference
- Local persistence for favorites and history
- Accessible labels, keyboard-focusable controls, mobile layout, and empty/error states

## Google AdSense

The repository includes the AdSense publisher verification meta tag and the official AdSense loader in `index.html`. It also includes `public/ads.txt` for the configured publisher ID.

**Before ads can be served:**

1. Deploy the site on its final HTTPS domain and add that exact domain to the eligible AdSense account.
2. Complete Google's site verification and review process. The code does not guarantee approval or immediate ad serving.
3. For Auto ads, enable Auto ads for the site in the AdSense account after the site is approved.
4. For the dashboard's manual ad placement, copy `.env.example` to `.env.local` and set a real ad-unit slot ID:
   ```bash
   VITE_ADSENSE_CLIENT_ID=ca-pub-1030876896435364
   VITE_ADSENSE_HEADER_SLOT=YOUR_REAL_AD_UNIT_SLOT_ID
   ```
5. Set `VITE_SITE_URL` and `VITE_SUPPORT_EMAIL` to the real production values, then rebuild and redeploy.

The publisher ID is a public identifier, not a secret. Never commit `.env.local` or credentials. The publisher account must belong to an eligible adult account holder. Review privacy/consent requirements for the countries where the site serves visitors before enabling ads. Never click your own ads or encourage visitors to click them.

## Routes

Tool pages are real browser routes and support direct navigation and refresh:

`/tools/json-formatter`, `/tools/base64`, `/tools/regex-tester`, `/tools/text-toolkit`, `/tools/url-encoder`, `/tools/uuid-generator`, `/tools/hash-generator`, `/tools/code-playground`, `/tools/csv-json`, `/tools/timestamp-converter`, `/tools/yaml-validator`, `/tools/color-converter`, `/tools/xml-formatter`, `/tools/markdown`, `/tools/sql-formatter`, `/tools/http-status`, and `/tools/cron`.

The workspace pages are `/`, `/favorites`, `/history`, and `/settings`. Unknown paths show a 404 state.

## Run locally

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run build
npm run preview
npm run typecheck
npm run test
npm run test:e2e
```

`npm run test:e2e` starts the production preview automatically. Install the browser once with `npx playwright install chromium`.

## Scope and limitations

This first production slice is client-only. There is no fake authentication, database, API proxy, cloud synchronization, or server-side code execution. Those features require a backend/security review and deployment-specific credentials; they are not exposed as completed functionality.

The playground executes only inside a sandboxed iframe. Tool data is not uploaded by the app. Clipboard actions require browser permission and HTTPS (or localhost).

## Architecture

- React 19 + TypeScript
- Vite
- Plain CSS design system with dark/light theme variables
- History API routing with refresh-safe Vite fallback
- Web Crypto API for hashing and UUID generation
- `yaml` parser for YAML conversion and validation
- `localStorage` for non-sensitive workspace preferences

## Production notes

### Netlify deployment

Netlify is the selected provider because this is a static Vite SPA and `public/_redirects` already provides the SPA fallback.

```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

The deployment command will print the real generated URL. Configure the same URL as `VITE_SITE_URL` in Netlify's environment variables and rebuild after changing it.

Deploy the Vite `dist` output to a static host. Configure SPA fallback to `index.html` so direct tool URLs resolve to the application entry point. Before adding account or API proxy features, introduce server-side validation, authentication, rate limiting, SSRF protection, and a database migration strategy.
