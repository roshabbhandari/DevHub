export type ToolId =
  | 'json'
  | 'base64'
  | 'regex'
  | 'text'
  | 'url'
  | 'uuid'
  | 'hash'
  | 'playground'
  | 'csv-json'
  | 'timestamp'
  | 'yaml'
  | 'color'
  | 'xml'
  | 'markdown'
  | 'sql'
  | 'http-status'
  | 'cron'

export type Tool = {
  id: ToolId
  name: string
  description: string
  category: string
  icon: string
  path: string
}
