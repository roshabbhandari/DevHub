export function formatJson(input: string, minified = false): string {
  if (!input.trim()) throw new Error('Input is empty.')
  return JSON.stringify(JSON.parse(input), null, minified ? 0 : 2)
}
