import { format } from 'sql-formatter'

export function formatSql(input: string): string {
  if (!input.trim()) throw new Error('SQL input is empty.')
  return format(input, { language: 'sql', tabWidth: 2, keywordCase: 'upper' })
}
