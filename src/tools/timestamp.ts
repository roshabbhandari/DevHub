export type TimestampMode = 'seconds' | 'milliseconds'

export function timestampToDate(input: string, mode: TimestampMode): Date {
  if (!input.trim() || !/^-?\d+$/.test(input.trim())) throw new Error('Enter a valid integer timestamp.')
  const date = new Date(Number(input) * (mode === 'seconds' ? 1000 : 1))
  if (Number.isNaN(date.getTime())) throw new Error('Timestamp is outside the supported date range.')
  return date
}

export function dateToTimestamp(input: string, mode: TimestampMode): string {
  const time = new Date(input).getTime()
  if (Number.isNaN(time)) throw new Error('Enter a valid date and time.')
  return String(mode === 'seconds' ? Math.floor(time / 1000) : time)
}

export function describeDate(date: Date) {
  return { iso: date.toISOString(), utc: date.toUTCString(), local: date.toString() }
}
