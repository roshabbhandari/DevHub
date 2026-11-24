export function testRegex(pattern: string, input: string, flags = 'g'): string[] {
  const expression = new RegExp(pattern, flags)
  return [...input.matchAll(expression)].map((match) => match[0])
}
