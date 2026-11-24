import type { ToolId } from '../types/tools'

export type AppRoute =
  | { kind: 'dashboard' }
  | { kind: 'favorites' }
  | { kind: 'history' }
  | { kind: 'settings' }
  | { kind: 'category'; category: string }
  | { kind: 'tool'; toolId: ToolId }
  | { kind: 'not-found' }
  | { kind: 'info'; page: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'cookies' }

const routes: Record<string, ToolId> = {
  '/tools/json-formatter': 'json',
  '/tools/json-validator': 'json',
  '/tools/base64': 'base64',
  '/tools/regex-tester': 'regex',
  '/tools/text-toolkit': 'text',
  '/tools/url-encoder': 'url',
  '/tools/uuid-generator': 'uuid',
  '/tools/hash-generator': 'hash',
  '/tools/code-playground': 'playground',
  '/tools/csv-json': 'csv-json',
  '/tools/timestamp-converter': 'timestamp',
  '/tools/yaml-validator': 'yaml',
  '/tools/color-converter': 'color',
  '/tools/xml-formatter': 'xml',
  '/tools/markdown': 'markdown',
  '/tools/sql-formatter': 'sql',
  '/tools/http-status': 'http-status',
  '/tools/cron': 'cron',
}

export function parseRoute(pathname = window.location.pathname): AppRoute {
  if (pathname === '/' || pathname === '/dashboard') return { kind: 'dashboard' }
  if (pathname === '/favorites') return { kind: 'favorites' }
  if (pathname === '/history') return { kind: 'history' }
  if (pathname === '/settings') return { kind: 'settings' }
  const infoPages = ['/about', '/contact', '/privacy', '/terms', '/disclaimer', '/cookies'] as const
  if (infoPages.includes(pathname as typeof infoPages[number])) return { kind: 'info', page: pathname.slice(1) as 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'cookies' }
  if (pathname.startsWith('/category/')) return { kind: 'category', category: decodeURIComponent(pathname.slice(10)) }
  const toolId = routes[pathname]
  return toolId ? { kind: 'tool', toolId } : { kind: 'not-found' }
}

export function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
