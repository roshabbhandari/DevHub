import type { Tool } from '../types/tools'

export const tools: Tool[] = [
  { id: 'json', name: 'JSON Formatter', description: 'Validate, format and minify JSON instantly.', category: 'Code Engineering', icon: '{ }', path: '/tools/json-formatter' },
  { id: 'base64', name: 'Base64 Encoder', description: 'Encode or decode UTF-8 text locally.', category: 'Code Engineering', icon: '⇄', path: '/tools/base64' },
  { id: 'regex', name: 'Regex Tester', description: 'Test patterns against sample text with matches.', category: 'Code Engineering', icon: '.*', path: '/tools/regex-tester' },
  { id: 'text', name: 'Text Toolkit', description: 'Count, transform and clean up text.', category: 'Code Engineering', icon: 'Aa', path: '/tools/text-toolkit' },
  { id: 'url', name: 'URL Encoder', description: 'Safely encode and decode URL components.', category: 'API Workspace', icon: '↗', path: '/tools/url-encoder' },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate cryptographically random UUIDs.', category: 'Security Tools', icon: '◇', path: '/tools/uuid-generator' },
  { id: 'hash', name: 'Hash Generator', description: 'Create SHA-256, SHA-384 or SHA-512 hashes.', category: 'Security Tools', icon: '#', path: '/tools/hash-generator' },
  { id: 'playground', name: 'Web Playground', description: 'Build HTML, CSS and JavaScript with a live preview.', category: 'Web Development', icon: '▶', path: '/tools/code-playground' },
  { id: 'csv-json', name: 'CSV / JSON Converter', description: 'Convert structured CSV and JSON data safely.', category: 'Data Utilities', icon: '⇆', path: '/tools/csv-json' },
  { id: 'timestamp', name: 'Timestamp Converter', description: 'Convert Unix timestamps and ISO dates accurately.', category: 'Data Utilities', icon: '◷', path: '/tools/timestamp-converter' },
  { id: 'yaml', name: 'YAML Validator', description: 'Validate, format, and convert YAML documents.', category: 'DevOps Toolkit', icon: 'Y:', path: '/tools/yaml-validator' },
  { id: 'color', name: 'Color Converter', description: 'Convert colors and calculate accessible contrast.', category: 'Web Development', icon: '◉', path: '/tools/color-converter' },
  { id: 'xml', name: 'XML Formatter', description: 'Validate and format XML documents locally.', category: 'Code Engineering', icon: '</>', path: '/tools/xml-formatter' },
  { id: 'markdown', name: 'Markdown Preview', description: 'Edit Markdown and preview rendered HTML.', category: 'Code Engineering', icon: 'M↓', path: '/tools/markdown' },
  { id: 'sql', name: 'SQL Formatter', description: 'Format SQL queries for clearer reviews.', category: 'Data Utilities', icon: 'SQL', path: '/tools/sql-formatter' },
  { id: 'http-status', name: 'HTTP Status Reference', description: 'Search common HTTP response codes and meanings.', category: 'API Workspace', icon: '↔', path: '/tools/http-status' },
  { id: 'cron', name: 'Cron Toolkit', description: 'Validate, explain, and preview cron schedules.', category: 'DevOps Toolkit', icon: '◴', path: '/tools/cron' },
]

export const categories = ['Code Engineering', 'Web Development', 'API Workspace', 'Data Utilities', 'Security Tools', 'DevOps Toolkit']
