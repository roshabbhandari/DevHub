import type { ToolId } from '../types/tools'

type ToolGuideContent = {
  heading: string
  overview: string
  steps: string[]
  example: string
  note: string
}

const guides: Record<ToolId, ToolGuideContent> = {
  json: {
    heading: 'Format and validate JSON',
    overview: 'JSON Formatter checks whether the input is valid JSON, then displays it with indentation or as a compact string. Use the formatted view when reviewing nested objects and arrays; use minified output when a system expects compact JSON.',
    steps: ['Paste a JSON object or array into the input panel.', 'Choose Pretty to add readable indentation or Minified to remove unnecessary whitespace.', 'Review any error message, then copy the result or download it as a .json file.'],
    example: 'Input: {"name":"Ada","active":true}\nPretty output:\n{\n  "name": "Ada",\n  "active": true\n}',
    note: 'JSON is stricter than JavaScript object syntax: property names and string values need double quotes, and comments or trailing commas are not valid JSON.',
  },
  base64: {
    heading: 'Encode and decode UTF-8 Base64',
    overview: 'Base64 represents bytes using printable text characters. It is useful when a text or binary value must travel through a format that expects text, but it is not encryption and does not hide the original content.',
    steps: ['Choose Encode to convert ordinary text into Base64.', 'Choose Decode to turn a valid Base64 string back into UTF-8 text.', 'Copy the output and test it in the system that will consume it.'],
    example: 'Text: Hello, DevHub!\nBase64: SGVsbG8sIERldkh1YiE=',
    note: 'Never use Base64 as a password-protection method. Anyone who receives a Base64 value can decode it; do not paste credentials or private keys into public tools.',
  },
  regex: {
    heading: 'Test a JavaScript regular expression',
    overview: 'Regex Tester runs a pattern against sample text and lists the matches. It uses JavaScript regular-expression syntax, so lookarounds, character classes, groups, and quantifiers follow the browser JavaScript engine.',
    steps: ['Enter a pattern without slash delimiters.', 'Paste sample text into the second input.', 'Review each match in the output and adjust the expression until it covers the intended cases.'],
    example: 'Pattern: \\b[A-Z][a-z]+\\b\nText: Hello from DevHub\nMatches: Hello',
    note: 'A pattern can behave differently across programming languages. Test edge cases and flags in the same runtime that will use the expression; complex patterns can also be expensive on large inputs.',
  },
  text: {
    heading: 'Transform text and inspect its length',
    overview: 'Text Toolkit changes letter casing and reports a basic word count and character count. It is useful for headings, labels, sample data, and checking text length before pasting it into another tool.',
    steps: ['Paste or type the text to transform.', 'Choose UPPERCASE, lowercase, or Title Case.', 'Check the word and character totals, then copy the transformed result.'],
    example: 'Input: Build tools that respect your focus.\nTitle Case: Build Tools That Respect Your Focus.',
    note: 'The word count uses whitespace-separated words, so it is a practical estimate rather than a language-aware linguistic count.',
  },
  url: {
    heading: 'Encode or decode a URL component',
    overview: 'URL Encoder converts reserved characters in a component, such as a query parameter value, into percent-encoded form. Decoding reverses that representation when the input contains valid percent escapes.',
    steps: ['Paste the individual text or parameter value.', 'Choose Encode to escape characters or Decode to restore them.', 'Copy the result into the appropriate part of your URL.'],
    example: 'Input: hello world & more\nEncoded component: hello%20world%20%26%20more',
    note: 'Encode a component rather than blindly encoding an entire URL. A full URL contains separators such as : / ? # & that have structural meaning.',
  },
  uuid: {
    heading: 'Generate random UUIDs',
    overview: 'UUID Generator creates version 4 UUID values using the browser cryptographic random-number API. These identifiers are useful for test records, local prototypes, and uniquely naming generated items.',
    steps: ['Select Generate UUID to create a new identifier.', 'Generate additional values as needed; the latest values are shown in the list.', 'Use Copy beside an identifier to copy it.'],
    example: 'Example format: 123e4567-e89b-42d3-a456-426614174000',
    note: 'A UUID is an identifier, not an access credential. Do not treat possession of a generated UUID as authorization to access a system.',
  },
  hash: {
    heading: 'Create SHA-2 digests in your browser',
    overview: 'Hash Generator computes a SHA-256, SHA-384, or SHA-512 digest from text using the Web Crypto API. A digest is a fixed-length fingerprint of the supplied input; changing one character changes the result.',
    steps: ['Enter the text to hash.', 'Choose the SHA-2 algorithm.', 'Select Generate hash, then copy the hexadecimal digest.'],
    example: 'Input: abc\nSHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    note: 'Hashing is not encryption and a digest cannot be decrypted. This general-purpose tool is not a password-storage system; production password storage needs a dedicated password-hashing scheme and server-side safeguards.',
  },
  playground: {
    heading: 'Preview a small HTML, CSS, and JavaScript example',
    overview: 'Web Playground combines three editable panels and displays their output in a sandboxed iframe. It is intended for short experiments and learning how markup, styles, and scripts work together.',
    steps: ['Write the page structure in the HTML panel.', 'Add visual rules in the CSS panel.', 'Add optional JavaScript and inspect the live preview.'],
    example: 'HTML: <h1>Hello</h1>\nCSS: h1 { color: seagreen; }\nJavaScript: document.querySelector("h1").textContent = "Hello, DevHub";',
    note: 'The preview is an isolated browser frame, not a production deployment or a complete security review. Do not enter secrets, personal data, or code that you do not understand.',
  },
  'csv-json': {
    heading: 'Convert tabular CSV and JSON data',
    overview: 'CSV / JSON Converter converts comma-separated rows into an array of objects, or converts an array of JSON objects into CSV text. Quoted CSV fields can contain commas, line breaks, and escaped quote characters.',
    steps: ['Choose CSV → JSON or JSON → CSV.', 'Paste the source data into the input panel.', 'Set the one-character delimiter if the data uses something other than a comma, then copy or download the result.'],
    example: 'CSV:\nname,role\nAda,Engineer\n\nJSON:\n[{"name":"Ada","role":"Engineer"}]',
    note: 'CSV-to-JSON treats the first row as the header row. Rows with missing values receive empty strings, and headers should be non-empty and unique for predictable output.',
  },
  timestamp: {
    heading: 'Convert Unix timestamps and date strings',
    overview: 'Timestamp Converter converts integer Unix timestamps to ISO, UTC, and local date representations, or converts a date string into seconds or milliseconds since 1 January 1970 UTC.',
    steps: ['Choose Timestamp → date or Date → timestamp.', 'Select seconds or milliseconds to match the source system.', 'Enter an integer timestamp or a date string, then review all returned date representations.'],
    example: 'Unix timestamp (seconds): 0\nISO date: 1970-01-01T00:00:00.000Z',
    note: 'Seconds and milliseconds differ by a factor of 1,000. Always confirm the unit and time zone expected by the API or log you are working with.',
  },
  yaml: {
    heading: 'Validate YAML and convert it to JSON',
    overview: 'YAML Validator parses YAML and converts it to formatted JSON. The reverse mode parses JSON and produces YAML, which is helpful when maintaining configuration files for tools that accept either format.',
    steps: ['Choose YAML → JSON or JSON → YAML.', 'Paste the document into the input panel.', 'Review parsing errors and copy or download the converted document.'],
    example: 'YAML:\nname: DevHub\nactive: true\n\nJSON:\n{\n  "name": "DevHub",\n  "active": true\n}',
    note: 'YAML supports features such as indentation-sensitive nesting and scalar types. Review the converted result before using it as production configuration, especially for values that look like dates, numbers, or booleans.',
  },
  color: {
    heading: 'Convert color values and check contrast',
    overview: 'Color Converter accepts three- or six-digit hexadecimal values and reports RGB and HSL representations. It also calculates the selected color’s contrast ratio against black and white.',
    steps: ['Choose a color with the picker or enter a HEX value such as #67e8c0.', 'Review the equivalent RGB and HSL values.', 'Compare the contrast ratios against black and white, then test the actual foreground/background pairing in your design.'],
    example: 'HEX: #ffffff\nRGB: 255, 255, 255\nContrast against black: 21:1',
    note: 'The displayed ratios compare the chosen color with black and white only. They do not evaluate every color combination, font size, focus state, or component in a full interface.',
  },
  xml: {
    heading: 'Validate and format XML',
    overview: 'XML Formatter checks that the document is well-formed, parses it, and returns an indented representation. It is useful for inspecting nested elements and attributes in feeds, configuration files, and API responses.',
    steps: ['Paste the XML document into the input panel.', 'Read any validation error and correct mismatched tags or malformed attributes.', 'Copy the formatted output or download it as an XML file.'],
    example: 'Input: <root><item id="1">DevHub</item></root>\nOutput:\n<root>\n  <item id="1">DevHub</item>\n</root>',
    note: 'Well-formed XML is not necessarily valid against a particular schema. This tool does not validate XSD, DTD, or application-specific business rules.',
  },
  markdown: {
    heading: 'Write Markdown and preview the rendered result',
    overview: 'Markdown Preview renders headings, paragraphs, emphasis, links, and code blocks as HTML in an isolated preview frame. Use it to check the structure and readability of README files, notes, and documentation drafts.',
    steps: ['Write Markdown in the editor panel.', 'Review the rendered preview beside the source.', 'Copy your source Markdown into the destination project or documentation system.'],
    example: '# Project notes\n\nA clear description with an inline code example.',
    note: 'The preview is for appearance, not a guarantee that every Markdown engine supports the same extensions. Keep private information out of drafts shared with others.',
  },
  sql: {
    heading: 'Format SQL for easier review',
    overview: 'SQL Formatter applies consistent whitespace and keyword layout to a query. It helps make clauses and joins easier to inspect during code review; it does not connect to a database or execute statements.',
    steps: ['Paste a SQL statement into the input panel.', 'Review the formatted query in the output panel.', 'Copy the result or download it as a .sql file, then test it in your database environment.'],
    example: 'Input: select id,name from users where active=true;\nFormatted:\nSELECT id, name\nFROM users\nWHERE active = TRUE;',
    note: 'Formatting does not prove that a query is correct or safe. Check the SQL dialect, table and column names, permissions, and query plan in the target database.',
  },
  'http-status': {
    heading: 'Look up common HTTP response codes',
    overview: 'HTTP Status Reference searches a curated list of common response codes and short explanations. Use it while debugging requests, reading logs, or documenting how an API responds.',
    steps: ['Enter a status number or a term such as redirect, forbidden, or server error.', 'Read the matching code, standard phrase, and short description.', 'Use the result as a starting point, then check the API documentation for endpoint-specific behavior.'],
    example: '200 OK — the request succeeded.\n404 Not Found — the requested resource could not be found.',
    note: 'The reference is intentionally concise and is not a complete copy of the HTTP specification. An API can define additional behavior in its own documentation.',
  },
  cron: {
    heading: 'Explain a cron schedule and preview upcoming runs',
    overview: 'Cron Toolkit accepts five-field or six-field cron expressions, labels each field, and shows the next five run times based on the current date and time of the browser.',
    steps: ['Enter a five-field or six-field cron expression.', 'Read the field-by-field breakdown.', 'Review the upcoming ISO timestamps and compare them with the scheduler’s configured time zone.'],
    example: 'Expression: */15 * * * *\nMeaning: every 15 minutes\nNext runs are shown as ISO timestamps.',
    note: 'Cron dialects differ between schedulers. Confirm whether the target platform expects five or six fields and how it handles time zones, daylight-saving changes, and special characters.',
  },
}

export function ToolGuide({ toolId }: { toolId: ToolId }) {
  const guide = guides[toolId]

  return (
    <article className="tool-guide" aria-labelledby="tool-guide-heading">
      <header>
        <p className="eyebrow">USAGE GUIDE</p>
        <h2 id="tool-guide-heading">{guide.heading}</h2>
        <p>{guide.overview}</p>
      </header>
      <div className="tool-guide-grid">
        <section>
          <h3>How to use this tool</h3>
          <ol>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
        <section>
          <h3>Example</h3>
          <pre>{guide.example}</pre>
        </section>
      </div>
      <aside className="tool-guide-note">
        <h3>Good to know</h3>
        <p>{guide.note}</p>
      </aside>
      <p className="tool-guide-privacy">Privacy note: ordinary tool input is processed in this browser by DevHub's client-side code and is not sent to a DevHub application server. Third-party scripts, browser services, or external resources have their own data practices. Avoid entering secrets or sensitive personal information.</p>
    </article>
  )
}
