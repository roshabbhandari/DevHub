import { useState } from 'react'
import { ToolGuide } from './ToolGuide'
import type { Tool } from '../types/tools'
import { encodeBase64, decodeBase64, encodeUrl, decodeUrl } from '../tools/encoding'
import { formatJson } from '../tools/json'
import { testRegex } from '../tools/regex'
import { generateUuid, hashText, type HashAlgorithm } from '../tools/hash'
import { csvToJson, jsonToCsv } from '../tools/csv'
import { dateToTimestamp, describeDate, timestampToDate, type TimestampMode } from '../tools/timestamp'
import { jsonToYaml, yamlToJson } from '../tools/yaml'
import { contrastRatio, hexToRgb, rgbToHex, rgbToHsl } from '../tools/color'
import { downloadText } from '../lib/download'
import { formatXml } from '../tools/xml'
import { markdownToHtml } from '../tools/markdown'
import { formatSql } from '../tools/sql'
import { explainCron, nextCronRuns } from '../tools/cron'

export function ToolView({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  let editor: React.ReactNode = null

  switch (tool.id) {
    case 'json': editor = <JsonTool />; break
    case 'base64': editor = <Base64Tool />; break
    case 'regex': editor = <RegexTool />; break
    case 'text': editor = <TextTool />; break
    case 'url': editor = <UrlTool />; break
    case 'uuid': editor = <UuidTool />; break
    case 'hash': editor = <HashTool />; break
    case 'playground': editor = <Playground />; break
    case 'csv-json': editor = <CsvTool />; break
    case 'timestamp': editor = <TimestampTool />; break
    case 'yaml': editor = <YamlTool />; break
    case 'color': editor = <ColorTool />; break
    case 'xml': editor = <XmlTool />; break
    case 'markdown': editor = <MarkdownTool />; break
    case 'sql': editor = <SqlTool />; break
    case 'http-status': editor = <HttpStatusTool />; break
    case 'cron': editor = <CronTool />; break
  }

  return (
    <div className="tool-page">
      <button className="back-button" onClick={onBack}>← Back to workspace</button>
      <div className="tool-title">
        <span className="tool-icon large">{tool.icon}</span>
        <div>
          <p className="eyebrow">{tool.category}</p>
          <h1>{tool.name}</h1>
          <p className="subtitle">{tool.description}</p>
        </div>
      </div>
      {editor}
      <ToolGuide toolId={tool.id} />
    </div>
  )
}

function ToolShell({ children, onReset, onCopy, onDownload, output }: { children: React.ReactNode; onReset: () => void; onCopy: () => void; onDownload?: () => void; output: string }) {
  return <div className="editor-layout"><div className="editor-panel"><div className="panel-head"><span>INPUT</span><button onClick={onReset}>Reset</button></div>{children}</div><div className="editor-panel output-panel"><div className="panel-head"><span>OUTPUT</span><div><button onClick={onCopy}>Copy</button>{onDownload && <button onClick={onDownload}>Download</button>}</div></div><pre className={output.startsWith('Error') ? 'error-output' : ''}>{output || 'Output will appear here.'}</pre></div></div>
}

function JsonTool() { const [input, setInput] = useState('{\n  "name": "DevHub",\n  "features": ["format", "validate"]\n}'); const [minify, setMinify] = useState(false); let output = ''; try { output = formatJson(input, minify) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid JSON'}` }; return <><div className="tool-options"><span>JSON mode</span><button className={minify ? '' : 'selected'} onClick={() => setMinify(false)}>Pretty</button><button className={minify ? 'selected' : ''} onClick={() => setMinify(true)}>Minified</button></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadText('formatted.json', output, 'application/json')}><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} aria-label="JSON input" /></ToolShell></> }
function Base64Tool() { const [input, setInput] = useState('Hello, DevHub!'); const [decode, setDecode] = useState(false); let output = ''; try { output = decode ? decodeBase64(input) : encodeBase64(input) } catch { output = 'Error: Input is not valid Base64.' }; return <><div className="tool-options"><button className={!decode ? 'selected' : ''} onClick={() => setDecode(false)}>Encode</button><button className={decode ? 'selected' : ''} onClick={() => setDecode(true)}>Decode</button></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} aria-label="Base64 input" /></ToolShell></> }
function RegexTool() { const [pattern, setPattern] = useState('\\b[A-Z][a-z]+\\b'); const [input, setInput] = useState('Hello from DevHub. Build better tools.'); let output = ''; try { const matches = testRegex(pattern, input); output = matches.length ? matches.join('\n') : 'No matches found.' } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid expression'}` }; return <ToolShell output={output} onReset={() => { setPattern(''); setInput('') }} onCopy={() => navigator.clipboard.writeText(output)}><div className="split-input"><input value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="Regular expression" aria-label="Regular expression" /><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Text to test" /></div></ToolShell> }
function TextTool() { const [input, setInput] = useState('Build tools that respect your focus.'); const [mode, setMode] = useState('UPPERCASE'); const output = mode === 'UPPERCASE' ? input.toUpperCase() : mode === 'lowercase' ? input.toLowerCase() : input.replace(/\b\w/g, (letter) => letter.toUpperCase()); return <><div className="tool-options">{['UPPERCASE', 'lowercase', 'Title Case'].map((item) => <button key={item} className={mode === item ? 'selected' : ''} onClick={() => setMode(item)}>{item}</button>)}<span className="tool-stat">{input.trim() ? input.trim().split(/\s+/).length : 0} words · {input.length} characters</span></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Text input" /></ToolShell></> }
function UrlTool() { const [input, setInput] = useState('https://devhub.local/search?q=hello world'); const [decode, setDecode] = useState(false); let output = ''; try { output = decode ? decodeUrl(input) : encodeUrl(input) } catch { output = 'Error: Could not decode URL component.' }; return <><div className="tool-options"><button className={!decode ? 'selected' : ''} onClick={() => setDecode(false)}>Encode</button><button className={decode ? 'selected' : ''} onClick={() => setDecode(true)}>Decode</button></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="URL input" /></ToolShell></> }
function UuidTool() { const [ids, setIds] = useState<string[]>([]); const generate = () => setIds((items) => [generateUuid(), ...items].slice(0, 20)); return <div className="generator"><button className="primary-button" onClick={generate}>＋ Generate UUID</button><div className="generated-list">{ids.length ? ids.map((id) => <div key={id}><code>{id}</code><button onClick={() => navigator.clipboard.writeText(id)}>Copy</button></div>) : <div className="empty-state"><span>◇</span><h3>Ready when you are</h3><p>Generated values stay in this browser.</p></div>}</div></div> }
function HashTool() { const [input, setInput] = useState(''); const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256'); const [output, setOutput] = useState(''); async function hash() { setOutput(await hashText(input, algorithm)) }; return <><div className="tool-options"><select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select><button className="selected" onClick={hash}>Generate hash</button></div><ToolShell output={output} onReset={() => { setInput(''); setOutput('') }} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter text to hash..." aria-label="Text to hash" /></ToolShell></> }
function Playground() { const [html, setHtml] = useState('<h1>Hello, DevHub</h1>\\n<p>Build something useful.</p>'); const [css, setCss] = useState('body { font-family: system-ui; padding: 2rem; color: #b6c2d9; background: #10131a; }\\nh1 { color: #67e8c0; }'); const [js, setJs] = useState(''); const src = `<style>${css}</style>${html}<script>${js.replaceAll('</', '<\\\\/')}</script>`; return <div className="playground"><div className="play-editors"><label>HTML<textarea value={html} onChange={(event) => setHtml(event.target.value)} /></label><label>CSS<textarea value={css} onChange={(event) => setCss(event.target.value)} /></label><label>JavaScript<textarea value={js} onChange={(event) => setJs(event.target.value)} /></label></div><div className="preview-head">LIVE PREVIEW <span>Sandboxed iframe</span></div><iframe title="Live web preview" sandbox="allow-scripts" srcDoc={src} /></div> }

function CsvTool() { const [input, setInput] = useState('name,role\nAda,Engineer\nGrace,Scientist'); const [mode, setMode] = useState<'csv' | 'json'>('csv'); const [delimiter, setDelimiter] = useState(','); let output = ''; try { output = mode === 'csv' ? csvToJson(input, { delimiter }) : jsonToCsv(input, delimiter) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid data'}` }; return <><div className="tool-options"><button className={mode === 'csv' ? 'selected' : ''} onClick={() => setMode('csv')}>CSV → JSON</button><button className={mode === 'json' ? 'selected' : ''} onClick={() => setMode('json')}>JSON → CSV</button><label>Delimiter <input value={delimiter} maxLength={1} onChange={(event) => setDelimiter(event.target.value)} /></label></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadText(mode === 'csv' ? 'converted.json' : 'converted.csv', output, 'text/plain')}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="CSV or JSON input" /></ToolShell></> }
function TimestampTool() { const [input, setInput] = useState('1700000000'); const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate'); const [unit, setUnit] = useState<TimestampMode>('seconds'); let output = ''; try { if (mode === 'toDate') output = JSON.stringify(describeDate(timestampToDate(input, unit)), null, 2); else output = dateToTimestamp(input, unit) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid date'}` }; return <><div className="tool-options"><button className={mode === 'toDate' ? 'selected' : ''} onClick={() => setMode('toDate')}>Timestamp → date</button><button className={mode === 'toTimestamp' ? 'selected' : ''} onClick={() => setMode('toTimestamp')}>Date → timestamp</button><select value={unit} onChange={(event) => setUnit(event.target.value as TimestampMode)}><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'toDate' ? 'Unix timestamp' : '2026-01-01T00:00:00Z'} aria-label="Timestamp input" /></ToolShell></> }
function YamlTool() { const [input, setInput] = useState(`name: DevHub
features:
  - tools
  - testing`); const [mode, setMode] = useState<'yaml' | 'json'>('yaml'); let output = ''; try { output = mode === 'yaml' ? yamlToJson(input) : jsonToYaml(input) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid YAML'}` }; return <><div className="tool-options"><button className={mode === 'yaml' ? 'selected' : ''} onClick={() => setMode('yaml')}>YAML → JSON</button><button className={mode === 'json' ? 'selected' : ''} onClick={() => setMode('json')}>JSON → YAML</button></div><ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadText(mode === 'yaml' ? 'converted.json' : 'converted.yaml', output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="YAML or JSON input" /></ToolShell></> }
function ColorTool() { const [input, setInput] = useState('#67e8c0'); let output = ''; try { const rgb = hexToRgb(input); output = JSON.stringify({ hex: rgbToHex(rgb), rgb, hsl: rgbToHsl(rgb), contrastOnWhite: contrastRatio(rgb, { r: 255, g: 255, b: 255 }), contrastOnBlack: contrastRatio(rgb, { r: 0, g: 0, b: 0 }) }, null, 2) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid color'}` }; return <ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><div><input className="color-input" type="color" value={input.startsWith('#') && input.length === 7 ? input : '#000000'} onChange={(event) => setInput(event.target.value)} aria-label="Color picker" /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="#67e8c0" aria-label="Hex color" /></div></ToolShell> }
function XmlTool() { const [input, setInput] = useState('<root><item id="1">DevHub</item></root>'); let output = ''; try { output = formatXml(input) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid XML'}` }; return <ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadText('formatted.xml', output, 'application/xml')}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="XML input" /></ToolShell> }
function MarkdownTool() {
  const [input, setInput] = useState('# DevHub\\n\\nBuild focused developer tools.')
  let output = ''
  try {
    output = markdownToHtml(input)
  } catch (error) {
    output = `<p>${error instanceof Error ? error.message : 'Invalid Markdown'}</p>`
  }

  const previewDocument = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<style>
body{font:15px/1.65 system-ui,sans-serif;color:#182131;padding:18px;overflow-wrap:anywhere}
pre,code{font-family:ui-monospace,monospace;background:#eef2f7;border-radius:4px}
code{padding:2px 4px}pre{padding:12px;overflow:auto}blockquote{border-left:3px solid #9aa8ba;padding-left:12px;color:#536176}
img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:6px}
</style>
</head>
<body>${output}</body>
</html>`

  return (
    <div className="markdown-tool">
      <div className="editor-panel">
        <div className="panel-head"><span>MARKDOWN</span><button onClick={() => setInput('')}>Reset</button></div>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Markdown input" />
      </div>
      <iframe
        className="markdown-preview"
        title="Sandboxed Markdown preview"
        sandbox=""
        referrerPolicy="no-referrer"
        srcDoc={previewDocument}
      />
    </div>
  )
}
function SqlTool() { const [input, setInput] = useState('select id, name from users where active = true order by name;'); let output = ''; try { output = formatSql(input) } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid SQL'}` }; return <ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)} onDownload={() => downloadText('formatted.sql', output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="SQL input" /></ToolShell> }
function HttpStatusTool() { const statuses = [{ code: 200, label: 'OK', detail: 'The request succeeded.' }, { code: 201, label: 'Created', detail: 'A resource was created.' }, { code: 301, label: 'Moved Permanently', detail: 'The resource has a new permanent URL.' }, { code: 400, label: 'Bad Request', detail: 'The server could not understand the request.' }, { code: 401, label: 'Unauthorized', detail: 'Authentication is required.' }, { code: 403, label: 'Forbidden', detail: 'The server refuses to authorize the request.' }, { code: 404, label: 'Not Found', detail: 'The requested resource does not exist.' }, { code: 429, label: 'Too Many Requests', detail: 'Rate limiting is active.' }, { code: 500, label: 'Internal Server Error', detail: 'The server encountered an unexpected condition.' }]; const [query, setQuery] = useState(''); const filtered = statuses.filter((status) => `${status.code} ${status.label} ${status.detail}`.toLowerCase().includes(query.toLowerCase())); return <div className="reference-tool"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search status codes..." aria-label="Search HTTP statuses" />{filtered.map((status) => <div className="reference-row" key={status.code}><strong>{status.code}</strong><span><b>{status.label}</b><small>{status.detail}</small></span></div>)}</div> }
function CronTool() { const [input, setInput] = useState('*/15 * * * *'); let output = ''; try { output = `Schedule\n${explainCron(input)}\n\nNext runs\n${nextCronRuns(input).join('\n')}` } catch (error) { output = `Error: ${error instanceof Error ? error.message : 'Invalid cron expression'}` }; return <ToolShell output={output} onReset={() => setInput('')} onCopy={() => navigator.clipboard.writeText(output)}><textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Cron expression" /></ToolShell> }
