export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

export async function hashText(input: string, algorithm: HashAlgorithm): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function generateUuid(): string {
  return crypto.randomUUID()
}
