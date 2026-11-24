import { useEffect, useState } from 'react'

export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? fallback : JSON.parse(stored) as T
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Preferences are optional; the application remains usable if storage is unavailable.
    }
  }, [key, value])

  return [value, setValue] as const
}
