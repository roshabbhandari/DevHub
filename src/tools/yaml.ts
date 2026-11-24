import { parse, stringify } from 'yaml'

export function yamlToJson(input: string): string {
  if (!input.trim()) throw new Error('YAML input is empty.')
  return JSON.stringify(parse(input), null, 2)
}

export function jsonToYaml(input: string): string {
  return stringify(JSON.parse(input))
}
