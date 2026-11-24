import { CronExpressionParser } from 'cron-parser'

export function nextCronRuns(expression: string, count = 5): string[] {
  if (!expression.trim()) throw new Error('Cron expression is empty.')
  const interval = CronExpressionParser.parse(expression, { currentDate: new Date() })
  return Array.from({ length: count }, () => {
    const next = interval.next().toISOString()
    if (!next) throw new Error('Cron parser returned an invalid next date.')
    return next
  })
}

export function explainCron(expression: string): string {
  const fields = expression.trim().split(/\s+/)
  if (fields.length !== 5 && fields.length !== 6) throw new Error('Use a 5-field or 6-field cron expression.')
  const labels = fields.length === 5
    ? ['minute', 'hour', 'day of month', 'month', 'day of week']
    : ['second', 'minute', 'hour', 'day of month', 'month', 'day of week']
  return fields.map((field, index) => `${labels[index]}: ${field}`).join('\n')
}
