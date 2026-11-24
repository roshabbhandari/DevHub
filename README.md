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

## Optional AdSense

Advertising is disabled unless real Google AdSense values are configured. Copy [.env.example](C:/Users/rosha/Desktop/web/.env.example) to `.env.local` and replace both values with the publisher client ID and ad slot ID issued by Google:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-...
VITE_ADSENSE_HEADER_SLOT=...
```

Never commit `.env.local`, use placeholder IDs in production, or load the script without valid consent/privacy configuration. The app does not block tools when ads are unavailable or blocked.

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

This first production slice is client-only. There is no fake authentication, database, API proxy, cloud synchronization, AdSense publisher configuration, or server-side code execution. Those features require a backend/security review and deployment-specific credentials; they are not exposed as completed functionality.

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

Netlify is the selected provider because this is a static Vite SPA and [public/_redirects](C:/Users/rosha/Desktop/web/public/_redirects) already provides the SPA fallback.

```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

The deployment command will print the real generated URL. No deployment was claimed from this environment because no Netlify CLI or authenticated provider session was available.

Deploy the Vite `dist` output to a static host. Configure SPA fallback to `index.html` so direct tool URLs resolve to the application entry point. Before adding account or API proxy features, introduce server-side validation, authentication, rate limiting, SSRF protection, and a database migration strategy.
