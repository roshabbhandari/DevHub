export function encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(escape(atob(input)))
}

export function encodeUrl(input: string): string {
  return encodeURIComponent(input)
}

export function decodeUrl(input: string): string {
  return decodeURIComponent(input)
}
