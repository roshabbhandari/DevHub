import type { AppRoute } from '../lib/router'

type InfoPage = Extract<AppRoute, { kind: 'info' }>['page']

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL as string | undefined
const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://dev-hub-nu-nine.vercel.app'
const issueUrl = 'https://github.com/roshabbhandari/DevHub/issues'

const content: Record<InfoPage, { eyebrow: string; title: string; intro: string }> = {
  about: { eyebrow: 'ABOUT DEVHUB', title: 'Useful tools for focused engineering work.', intro: 'DevHub is a browser-based workspace of practical utilities for developers, students, and people learning software engineering. It brings common formatting, conversion, testing, and reference tasks into one place without requiring a DevHub account.' },
  contact: { eyebrow: 'CONTACT', title: 'Help us improve DevHub.', intro: 'Report a reproducible bug, suggest an improvement, or ask a question through the public project issue tracker. Do not include passwords, API keys, personal information, or confidential source code in a report.' },
  privacy: { eyebrow: 'PRIVACY POLICY', title: 'Understand what DevHub stores and sends.', intro: 'This page describes the current website implementation. The site owner should review it whenever the hosting provider, advertising setup, analytics, or data practices change and obtain jurisdiction-specific advice where needed.' },
  terms: { eyebrow: 'TERMS OF USE', title: 'Use DevHub responsibly.', intro: 'These plain-language terms describe the current browser-based utilities. They are not legal advice and do not replace any mandatory consumer or privacy rights that apply in your location.' },
  disclaimer: { eyebrow: 'DISCLAIMER', title: 'Verify important outputs.', intro: 'DevHub provides convenience utilities for development workflows. Results are provided as-is and should be checked in the target environment before being used for important work.' },
  cookies: { eyebrow: 'COOKIES & ADVERTISING', title: 'Understand advertising and privacy choices.', intro: 'DevHub includes Google AdSense and Funding Choices scripts. The messages shown to visitors and the availability of ads depend on the publisher account configuration, site review, consent settings, and applicable regional requirements.' },
}

export function InfoPage({ page }: { page: InfoPage }) {
  const details = content[page]
  return (
    <article className="info-page">
      <p className="eyebrow">{details.eyebrow}</p>
      <h1>{details.title}</h1>
      <p className="info-intro">{details.intro}</p>
      {page === 'about' && <AboutContent />}
      {page === 'contact' && <ContactContent />}
      {page === 'privacy' && <PrivacyContent />}
      {page === 'terms' && <TermsContent />}
      {page === 'disclaimer' && <DisclaimerContent />}
      {page === 'cookies' && <CookiesContent />}
    </article>
  )
}

function AboutContent() {
  return <InfoSections sections={[
    ['Tools available', 'DevHub currently includes a JSON formatter, Base64 encoder and decoder, regular-expression tester, text case toolkit, URL component encoder, UUID generator, SHA-2 hash generator, HTML/CSS/JavaScript playground, CSV and JSON converter, timestamp converter, YAML validator and converter, color converter with contrast ratios, XML formatter, Markdown preview, SQL formatter, HTTP status reference, and cron expression toolkit.'],
    ['How the tools work', 'The ordinary formatters, converters, and reference utilities run in the visitor’s browser. DevHub does not send those tool inputs to a DevHub application server. The playground runs its preview in a sandboxed iframe. Browser storage is used for theme preference, favorites, and recent tool IDs.'],
    ['What the tools do not do', 'The workspace does not execute SQL against a database, host or deploy projects, validate API credentials, provide a security certification, or guarantee that generated output is suitable for production. Always verify important results in the target environment.'],
    ['Advertising', 'Google AdSense and Funding Choices scripts are included. Ads are served only when the publisher account, site review, consent settings, ad configuration, and Google policies permit them. Their presence in the code does not mean the site has been approved or that ads are currently being served.'],
  ]} />
}

function ContactContent() {
  return <>
    <InfoSections sections={[
      ['Project issue tracker', 'Use the public GitHub issue tracker to report a reproducible bug or suggest an improvement. Describe the page, browser, expected result, actual result, and steps to reproduce. Remove secrets and personal information from examples.'],
      ['Email support', supportEmail ? `For support by email, contact ${supportEmail}.` : 'A monitored email address has not been configured for this deployment. Use the public GitHub issue tracker instead.'],
      ['Response expectations', 'DevHub is an independent project. A report is not a guarantee of a response time, fix, or feature release.'],
    ]} />
    <a className="info-link" href={issueUrl} target="_blank" rel="noopener noreferrer">Open DevHub on GitHub</a>
    {supportEmail && <a className="info-link" href={`mailto:${supportEmail}`}>Email DevHub support</a>}
  </>
}

function PrivacyContent() {
  return <InfoSections sections={[
    ['Local browser storage', 'DevHub stores the selected theme, favorite tool IDs, and recent tool IDs in localStorage on the current browser. These values support workspace preferences and are not a DevHub account or cloud-synchronization service. Clearing site data removes them.'],
    ['Tool input and processing', 'The ordinary formatting, conversion, hashing, and reference tools process their input with client-side browser code. DevHub does not submit these tool inputs to a DevHub application API. Do not enter secrets or sensitive personal information into a browser utility unless you have reviewed the code and are comfortable with the context.'],
    ['Third-party scripts and hosting', `The production site is ${siteUrl}. The hosting provider receives normal web requests and may process server logs. Google AdSense and Funding Choices scripts are also loaded; Google may process information, cookies, or similar identifiers according to its own terms and privacy documentation. Third-party services have data practices separate from DevHub.`],
    ['Advertising and consent', 'Google Funding Choices is included to support Google privacy and consent messages. The site owner must configure and publish the appropriate messages in AdSense Privacy & messaging. Personalized advertising in the EEA, UK, and Switzerland has additional certified-CMP requirements. The scripts alone do not prove that a particular legal consent requirement has been met.'],
    ['Your choices', 'Use the consent choices presented on the site where available. You can also manage or clear site data in your browser settings. Google provides separate controls and information about its advertising technologies in its own privacy resources.'],
    ['Contact', supportEmail ? `Privacy questions can be sent to ${supportEmail}.` : `Privacy questions can be raised through the project issue tracker: ${issueUrl}. Do not post personal or sensitive information publicly.`],
  ]} />
}

function TermsContent() {
  return <InfoSections sections={[
    ['Acceptable use', 'Use DevHub lawfully and only with data and systems you are authorized to use. Do not use the site to attack systems, evade access controls, or interfere with other users.'],
    ['Outputs and responsibility', 'Review generated output before using it in production, security-sensitive work, migrations, or compliance decisions. Formatting and conversion do not prove that data is correct, safe, or compatible with a particular platform.'],
    ['Third-party services', 'Hosting, browser APIs, Google advertising and consent tools, and linked reference sites are operated under their respective terms and privacy policies.'],
    ['Availability and changes', 'Features may change, be removed, or become temporarily unavailable. No uptime, compatibility, or suitability guarantee is made by this page.'],
  ]} />
}

function DisclaimerContent() {
  return <InfoSections sections={[
    ['Not professional advice', 'DevHub output is a development aid. It is not a substitute for professional security review, legal advice, production testing, or operational change control.'],
    ['Verify critical results', 'Check syntax, semantics, versions, time zones, encoding assumptions, data types, and security impact before relying on output. Test in the actual environment that will use the result.'],
    ['Tool limitations', 'The HTTP status page is a concise reference, the XML tool checks well-formedness rather than a particular schema, the color tool compares the selected color only with black and white, and the cron tool cannot know every scheduler-specific convention.'],
    ['External references', 'External documentation and linked services belong to their respective owners. DevHub does not claim endorsement or partnership unless explicitly documented.'],
  ]} />
}

function CookiesContent() {
  return <InfoSections sections={[
    ['Workspace storage', 'The application uses localStorage for non-sensitive preferences such as theme, favorites, and recent tool IDs. These preferences remain in the current browser and can be cleared through its site-data settings.'],
    ['Google advertising scripts', 'The page includes the Google AdSense loader and Google Funding Choices script. The AdSense loader makes the site eligible to request ads only after the account and site meet Google requirements. The Funding Choices script supports privacy messages, but a message must also be configured and published in AdSense Privacy & messaging.'],
    ['Regional consent', 'Google requires a certified CMP integrated with the IAB Transparency and Consent Framework when serving personalized ads to users in the EEA, UK, and Switzerland. The site owner must configure a message and settings appropriate to the audience and applicable laws.'],
    ['Ad serving status', 'A script, publisher verification tag, or ads.txt file does not equal approval. Google must review the site and show a Ready status before ads can be served. Auto ads or real manual ad-unit placements must also be configured in the account.'],
  ]} />
}

function InfoSections({ sections }: { sections: string[][] }) {
  return <div className="info-sections">
    {sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
  </div>
}
