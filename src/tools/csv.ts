export type CsvOptions = { delimiter?: string; hasHeader?: boolean }

function parseRows(input: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === delimiter && !quoted) {
      row.push(field)
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1
      row.push(field)
      if (row.some((value) => value !== '')) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }
  if (quoted) throw new Error('CSV contains an unterminated quoted field.')
  row.push(field)
  if (row.some((value) => value !== '')) rows.push(row)
  return rows
}

export function csvToJson(input: string, options: CsvOptions = {}): string {
  if (!input.trim()) throw new Error('CSV input is empty.')
  const rows = parseRows(input, options.delimiter ?? ',')
  if (rows.length === 0) return '[]'
  if (options.hasHeader === false) return JSON.stringify(rows, null, 2)
  const headers = rows[0]
  if (headers.some((header) => !header.trim())) throw new Error('CSV headers cannot be empty.')
  return JSON.stringify(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']))), null, 2)
}

function escapeCsv(value: unknown, delimiter: string): string {
  const text = String(value ?? '')
  return /["\r\n]/.test(text) || text.includes(delimiter) ? `"${text.replaceAll('"', '""')}"` : text
}

export function jsonToCsv(input: string, delimiter = ','): string {
  const parsed: unknown = JSON.parse(input)
  if (!Array.isArray(parsed) || parsed.some((row) => typeof row !== 'object' || row === null || Array.isArray(row))) {
    throw new Error('JSON must be an array of objects.')
  }
  const keys = [...new Set(parsed.flatMap((row) => Object.keys(row)))]
  return [keys.map((key) => escapeCsv(key, delimiter)).join(delimiter), ...parsed.map((row) => keys.map((key) => escapeCsv((row as Record<string, unknown>)[key], delimiter)).join(delimiter))].join('\n')
}
