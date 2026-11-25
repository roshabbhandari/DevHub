# DevHub

DevHub is a responsive browser-based workspace of developer utilities. It is intended to be useful without a DevHub account: ordinary tool inputs are processed by client-side code, while theme, favorite tool IDs, and recent tool IDs are stored in the current browser.

## Tools

DevHub currently includes 17 tools across six categories:

- **Code engineering:** JSON formatter and validator, Base64 encoder/decoder, regular-expression tester, text case toolkit, XML formatter, Markdown preview, and SQL formatter
- **Web development:** HTML/CSS/JavaScript playground and color converter with RGB/HSL and black/white contrast calculations
- **API workspace:** URL component encoder/decoder and HTTP status reference
- **Data utilities:** CSV ↔ JSON converter and Unix timestamp/date converter
- **Security utilities:** UUID v4 generator and SHA-256/SHA-384/SHA-512 digest generator
- **DevOps toolkit:** YAML validator/converter and cron expression explainer with upcoming run previews

Every tool page includes instructions, examples, and a note about limitations. The app also includes search, categories, favorites, recent tools, dark/light theme, and About, Contact, Privacy, Terms, Disclaimer, and Cookies & Advertising pages.

## How processing and storage work

The ordinary formatting, conversion, hashing, and reference utilities run in the visitor's browser. DevHub does not submit ordinary tool inputs to a DevHub application API. The Web Playground uses a sandboxed iframe, and the Markdown preview is also isolated in a sandboxed iframe.

The app stores theme preference, favorite tool IDs, and recent tool IDs in browser localStorage. These values are local to the current browser and are not synchronized to a DevHub account. Browser requests, hosting logs, Google advertising scripts, and external browser services have separate data practices. Visitors should not paste secrets or sensitive personal information into public web tools.

## Google AdSense

The repository includes the publisher verification meta tag and the official AdSense loader in `index.html`, the Funding Choices script, and the authorized-seller declaration in `public/ads.txt`.

The AdSense publisher ID in this repository is a public integration identifier. Confirm that it belongs to the eligible adult account holder who owns the AdSense account before publishing the site.

**These code files do not guarantee approval or start ads by themselves.** Before ads can be served:

1. Deploy the latest `main` branch to the final HTTPS domain.
2. Add that exact production domain to the eligible AdSense account and complete Google's site review.
3. Confirm that `https://dev-hub-nu-nine.vercel.app/ads.txt` returns the publisher line from `public/ads.txt`.
4. Configure and publish appropriate consent messages under AdSense **Privacy & messaging**. The Funding Choices script alone does not create or publish a message.
5. After the site is approved, enable Auto ads in the AdSense account, or set a real ad-unit slot ID for the dashboard's manual placement.

For the dashboard's manual ad unit, configure these Vercel project environment variables, then redeploy:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-1030876896435364
VITE_ADSENSE_HEADER_SLOT=YOUR_REAL_AD_UNIT_SLOT_ID
VITE_SITE_URL=https://dev-hub-nu-nine.vercel.app
VITE_SUPPORT_EMAIL=YOUR_MONITORED_SUPPORT_EMAIL
```

If using Auto ads only, the manual slot variable can remain empty. Never commit `.env.local`, account passwords, or private credentials. AdSense requirements and regional consent rules can change; review the current Google guidance before enabling ads. Never click your own ads or encourage visitors to click them.

## Public routes

Tool routes:

`/tools/json-formatter`, `/tools/base64`, `/tools/regex-tester`, `/tools/text-toolkit`, `/tools/url-encoder`, `/tools/uuid-generator`, `/tools/hash-generator`, `/tools/code-playground`, `/tools/csv-json`, `/tools/timestamp-converter`, `/tools/yaml-validator`, `/tools/color-converter`, `/tools/xml-formatter`, `/tools/markdown`, `/tools/sql-formatter`, `/tools/http-status`, and `/tools/cron`.

Information pages: `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, and `/cookies`.

Private browser workspace pages such as favorites, history, and settings are marked noindex and excluded from the sitemap.

## Local development

Requirements: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
npm run test:e2e
```

Install Playwright Chromium once before running end-to-end tests:

```bash
npx playwright install chromium
```

GitHub Actions runs lint, type-checking, unit tests, a production build, and Playwright end-to-end tests on pushes and pull requests to `main`.

## Deploy to Vercel

This repository is configured as a Vite static site.

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- Production branch: `main`

Connect the GitHub repository to Vercel, configure the environment variables above in the Vercel project settings, and deploy the latest `main` commit. After deployment, check these public files:

- `/ads.txt`
- `/robots.txt`
- `/sitemap.xml`

The sitemap and canonical URL currently use `https://dev-hub-nu-nine.vercel.app`. If the production domain changes, update the canonical/social URLs in `index.html`, the `siteOrigin` constant in `src/App.tsx`, `public/robots.txt`, and `public/sitemap.xml`, then redeploy.

## Scope and limitations

DevHub is currently a client-side tool collection. It does not provide a database, user accounts, cloud synchronization, a server-side code execution environment, database connectivity, project hosting, or production security certification. Formatting and conversion tools do not guarantee that output is correct or safe for every platform. Test important output in its target environment.
