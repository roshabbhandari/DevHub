import { marked } from 'marked'

export function markdownToHtml(input: string): string {
  if (!input.trim()) throw new Error('Markdown input is empty.')
  return marked.parse(input, { async: false }) as string
}
