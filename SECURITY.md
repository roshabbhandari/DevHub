# Security notes

## Current guarantees

- No credentials, secrets, or user content are sent to a DevHub server.
- Hashing and UUID generation use the browser Web Crypto API.
- The web playground uses an iframe with `sandbox="allow-scripts"` and does not grant same-origin or form permissions.
- The app does not execute shell commands or arbitrary code on an application server.
- Sensitive values should not be placed in browser local storage; the app only persists favorites, recent tool IDs, and theme preference.
- The live playground is isolated with a sandboxed iframe and does not grant same-origin access.
- CSV, YAML, timestamp, and color processing happens locally without network requests.
- AdSense is opt-in configuration: its script is not loaded until a real client ID and slot are present.
- AdSense configuration values are public identifiers, not secrets; never place private credentials in `VITE_*` variables.

## Before adding network features

Any API request proxy must validate URLs, resolve and block private/link-local addresses, restrict redirects, enforce timeouts and response-size limits, authenticate where required, and apply rate limits. Never expose server credentials in client bundles.

Any account system must use a maintained password hashing library, secure HTTP-only sessions, CSRF protection where applicable, explicit authorization checks, and verified email/reset flows only when a real email provider is configured.

## Static deployment

The production build is a client-side application. Configure the hosting provider's “fallback to `index.html`” behavior for `/tools/*`, `/category/*`, `/favorites`, `/history`, and `/settings`; otherwise direct refreshes will return a host-level 404 before the app can render its own route state.
