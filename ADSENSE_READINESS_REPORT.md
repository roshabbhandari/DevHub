# DevHub AdSense Readiness Report

This report describes the current repository implementation only. Google makes the final AdSense decision independently; this project does not claim approval or guaranteed ad serving.

## Current status

| Area | Repository status | Remaining action |
| --- | --- | --- |
| Developer utilities | IMPLEMENTED | Owner should manually review the live user experience on desktop and mobile. |
| Original tool guidance | IMPLEMENTED | Each of the 17 tool pages now includes an overview, steps, example, and limitations note. |
| Essential information pages | IMPLEMENTED | Owner must confirm all policy wording matches the real deployment and legal requirements. |
| AdSense verification | CODE ADDED | Verify the live page source on the deployed domain. |
| AdSense loader | CODE ADDED | Ads will not appear until the publisher account and site are eligible and ad serving is configured. |
| Funding Choices | SCRIPT ADDED | Configure and publish the appropriate messages in AdSense Privacy & messaging. |
| ads.txt | FILE ADDED | Confirm the live root URL serves the expected line and that the publisher ID belongs to the account owner. |
| Search/canonical metadata | IMPLEMENTED | Canonical URLs currently target the Vercel domain documented in the repository. Update if the production domain changes. |
| Sitemap and robots.txt | IMPLEMENTED | Submit the live sitemap in Search Console and verify crawl access. |
| Automated CI | PASSING | Latest checked CI run passed lint, typecheck, unit tests, build, and Playwright end-to-end tests. |
| Production deployment | NOT VERIFIED | Deploy the latest main branch to Vercel and test the live site. |
| AdSense site approval | NOT VERIFIED | Add the production domain to the eligible account and wait for Google's site review. |
| Manual ad placement | OPTIONAL OWNER SETUP | Set a real VITE_ADSENSE_HEADER_SLOT if using the dashboard's manual AdSlot component. |
| Auto ads | ACCOUNT ACTION REQUIRED | Enable Auto ads in the AdSense account after the site is approved. |
| Consent configuration | ACCOUNT ACTION REQUIRED | Publish the appropriate CMP/privacy messages for the website's audience and applicable regions. |
| Contact details | OWNER INPUT | Set VITE_SUPPORT_EMAIL to a monitored address, or retain the clearly disclosed public GitHub issue-tracker contact. |
| Accessibility audit | NOT RUN | Generate Lighthouse/axe results on the deployed site. |

## Content and navigation

DevHub includes 17 browser-based developer utilities across six categories. Every tool page includes an original usage guide, practical example, and limitations note. The homepage explains the site's scope and how data is handled. About, Contact, Privacy, Terms, Disclaimer, and Cookies & Advertising pages are routed and linked in the footer.

The homepage no longer contains a fabricated user greeting, static date, or non-functional Pro upsell. Navigation links point to real pages. Favorites, history, and settings are browser-local utility pages and are marked noindex.

## Privacy and processing

The application stores theme preference, favorite tool IDs, and recent tool IDs in browser localStorage. Ordinary format, conversion, hashing, and reference-tool inputs are processed by client-side application code and are not sent to a DevHub application API. The Web Playground and Markdown preview render in sandboxed iframes.

The hosting provider receives normal web requests and may maintain server logs. Google AdSense and Funding Choices scripts are included and may process data under Google's terms and privacy documentation. Third-party services have separate data practices. The owner must check that the published privacy notice accurately reflects the live configuration and must not assume that adding a CMP script by itself satisfies every legal consent requirement.

## Advertising implementation

- The AdSense publisher verification meta tag is present in index.html.
- The official AdSense loader is present in index.html and is marked so the React component can detect the existing script.
- public/ads.txt contains the authorized-seller line supplied for this publisher ID.
- The reusable AdSlot component renders the dashboard's manual ad unit only when a publisher client ID and real ad slot ID are configured.
- If using Auto ads, enable Auto ads from the eligible AdSense account after Google's site review. The manual slot ID can remain empty if no manual placements are used.
- A script, meta tag, or ads.txt file does not establish that Google has approved the site or that ads are being served.
- The site must not encourage clicks or manipulate impressions.

## Automated verification

The latest successful GitHub Actions run for the main branch passed:

- npm run lint
- npm run typecheck
- npm run test
- npm run build
- npm run test:e2e

The CI workflow is at .github/workflows/ci.yml. It also tests that the generated production output includes the AdSense crawler files, canonical metadata, guide pages, and sandboxed Markdown preview.

## Remaining launch checklist

1. Confirm the publisher ID belongs to the eligible adult account holder managing the AdSense account.
2. Deploy the latest main branch to the final HTTPS domain on Vercel.
3. In the Vercel project, set VITE_ADSENSE_CLIENT_ID, the real VITE_ADSENSE_HEADER_SLOT if using manual ads, VITE_SITE_URL, and a monitored VITE_SUPPORT_EMAIL; rebuild after changing variables.
4. Verify the live /ads.txt, /robots.txt, /sitemap.xml, and the AdSense verification meta tag.
5. Add the exact production domain in AdSense and complete Google's site review.
6. Configure and publish applicable privacy/consent messages in AdSense Privacy & messaging.
7. After Google marks the site Ready, enable Auto ads or use valid manual ad-unit IDs.
8. Run a Lighthouse/axe accessibility check and review the deployed pages manually.

## Official references

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724)
- [Pages ready for AdSense](https://support.google.com/adsense/answer/7299563)
- [AdSense program policies](https://support.google.com/adsense/answer/48182)
- [Connecting a site to AdSense](https://support.google.com/adsense/answer/7584263)
- [Common approval issues](https://support.google.com/adsense/answer/81904)
