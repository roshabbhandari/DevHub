import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser'

export function formatXml(input: string): string {
  if (!input.trim()) throw new Error('XML input is empty.')
  const validation = XMLValidator.validate(input)
  if (validation !== true) throw new Error(validation.err.msg)
  const parsed = new XMLParser({ preserveOrder: true, ignoreAttributes: false }).parse(input)
  const serialized = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, format: true, indentBy: '  ' }).build(parsed)
  return serialized.trim()
}
