import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { categories, tools } from './config/tools'
import { navigate, parseRoute, type AppRoute } from './lib/router'
import { useStored } from './lib/storage'
import type { Tool } from './types/tools'
import { ToolView } from './components/ToolView'
import { AdSlot } from './components/AdSlot'
import { InfoPage } from './components/InfoPage'

const recentKey = 'devhub-recent'
const favoriteKey = 'devhub-favorites'

function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useStored<'dark' | 'light'>('devhub-theme', 'dark')
  const [favorites, setFavorites] = useStored<string[]>(favoriteKey, [])
  const [recent, setRecent] = useStored<string[]>(recentKey, [])

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false) }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const activeTool = route.kind === 'tool' ? tools.find((tool) => tool.id === route.toolId) : undefined
  const activeCategory = route.kind === 'category' ? route.category : undefined
  const visibleTools = useMemo(() => tools.filter((tool) => {
    const matchesSearch = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !activeCategory || tool.category === activeCategory
    const matchesFavorites = route.kind !== 'favorites' || favorites.includes(tool.id)
    return matchesSearch && matchesCategory && matchesFavorites
  }), [activeCategory, favorites, query, route.kind])

  function open(path: string, toolId?: string) {
    navigate(path)
    setMobileMenuOpen(false)
    if (toolId) setRecent((items) => [toolId, ...items.filter((item) => item !== toolId)].slice(0, 5))
  }
  function toggleFavorite(id: string) {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }
  const dashboard = route.kind === 'dashboard' || route.kind === 'favorites' || route.kind === 'category'

  return <div className="app-shell">
    <button className="mobile-menu-button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}>☰</button><div className={`mobile-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)} /><Sidebar route={route} favorites={favorites.length} onOpen={open} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><b>{activeTool?.name ?? route.kind === 'dashboard' ? 'Dashboard' : route.kind}</b></div><div className="top-actions"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." /><kbd>⌘ K</kbd></label><button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☼' : '☾'}</button><button className="help-button">?</button><div className="profile">R</div></div></header>
      {activeTool ? <ToolView tool={activeTool} onBack={() => open('/')} /> : dashboard ? <Dashboard tools={visibleTools} recent={recent} favorites={favorites} onOpen={open} onFavorite={toggleFavorite} query={query} /> : route.kind === 'history' ? <History recent={recent} onOpen={open} /> : route.kind === 'settings' ? <Settings theme={theme} setTheme={setTheme} /> : route.kind === 'info' ? <InfoPage page={route.page} /> : <NotFound onHome={() => open('/')} />}
      <Footer onOpen={open} />
    </main>
  </div>
}

function Sidebar({ route, favorites, onOpen, isOpen, onClose }: { route: AppRoute; favorites: number; onOpen: (path: string) => void; isOpen: boolean; onClose: () => void }) {
  return <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Application navigation"><div className="brand"><span className="brand-mark">D</span><span>DevHub</span><span className="beta">BETA</span><button className="mobile-close" aria-label="Close navigation" onClick={onClose}>×</button></div><div className="workspace-switcher"><span className="avatar">R</span><span><b>Personal workspace</b><small>Free plan</small></span><span className="chevron">⌄</span></div><nav aria-label="Primary navigation"><p className="nav-label">Workspace</p><NavButton icon="⌂" label="Dashboard" active={route.kind === 'dashboard'} onClick={() => onOpen('/')} /><NavButton icon="⌕" label="Discover tools" active={route.kind === 'category' && !route.category} onClick={() => onOpen('/')} /><NavButton icon="▣" label="Code Studio" active={route.kind === 'category' && route.category === 'Code Engineering'} onClick={() => onOpen('/category/Code%20Engineering')} /><NavButton icon="⌁" label="API Workspace" active={route.kind === 'category' && route.category === 'API Workspace'} onClick={() => onOpen('/category/API%20Workspace')} /><p className="nav-label">Library</p><NavButton icon="★" label="Favorites" active={route.kind === 'favorites'} onClick={() => onOpen('/favorites')} count={favorites} /><NavButton icon="◷" label="History" active={route.kind === 'history'} onClick={() => onOpen('/history')} /><NavButton icon="▤" label="Documentation" active={false} onClick={() => onOpen('/')} /></nav><div className="sidebar-bottom"><NavButton icon="⚙" label="Settings" active={route.kind === 'settings'} onClick={() => onOpen('/settings')} /><div className="plan-card"><div className="plan-icon">✦</div><b>Unlock your workflow</b><p>Save more projects with Pro.</p><button>View plans <span>→</span></button></div><small className="version">DevHub v0.2.0 · Local mode</small></div></aside>
}

function NavButton({ icon, label, active, onClick, count }: { icon: string; label: string; active: boolean; onClick: () => void; count?: number }) { return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}><span>{icon}</span>{label}{count ? <em>{count}</em> : null}</button> }

function Dashboard({ tools: visibleTools, recent, favorites, onOpen, onFavorite, query }: { tools: Tool[]; recent: string[]; favorites: string[]; onOpen: (path: string, toolId?: string) => void; onFavorite: (id: string) => void; query: string }) {
  const recentTools = recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[]
  return <div className="page"><section className="welcome"><div><p className="eyebrow">MONDAY, NOVEMBER 24, 2026</p><h1>Good morning, Roshan <span>✦</span></h1><p className="subtitle">Your developer workspace, ready when you are.</p></div><button className="primary-button" onClick={() => document.querySelector<HTMLInputElement>('.search input')?.focus()}>⌕ <span>Find a tool</span><kbd>⌘ K</kbd></button></section><AdSlot slot={import.meta.env.VITE_ADSENSE_HEADER_SLOT as string | undefined} /><section className="metrics"><Metric icon="⚡" label="Tools used" value={`${recent.length}`} helper="this session" /><Metric icon="★" label="Favorites" value={`${favorites.length}`} helper="saved tools" /><Metric icon="◷" label="Time saved" value="—" helper="start using tools" /><Metric icon="◈" label="Workspace" value="Local" helper="data stays in browser" /></section>{query ? <ToolGrid title={`Search results for “${query}”`} tools={visibleTools} onOpen={onOpen} onFavorite={onFavorite} favorites={favorites} /> : <><section className="section-heading"><div><h2>{visibleTools.length === tools.length ? 'Quick access' : 'Tools'}</h2><p>Popular tools for your everyday workflow.</p></div></section><ToolGrid title="" tools={visibleTools.slice(0, 8)} onOpen={onOpen} onFavorite={onFavorite} favorites={favorites} />{recentTools.length > 0 && <><section className="section-heading"><div><h2>Continue working</h2><p>Pick up where you left off.</p></div></section><div className="recent-row">{recentTools.map((tool) => <button className="recent-card" key={tool.id} onClick={() => onOpen(tool.path, tool.id)}><span className="tool-icon small">{tool.icon}</span><span><b>{tool.name}</b><small>{tool.category}</small></span><span className="arrow">→</span></button>)}</div></>}<section className="section-heading category-heading"><div><h2>Explore by category</h2><p>Find the right tool for every engineering task.</p></div></section><div className="category-grid">{categories.map((category, index) => <button key={category} onClick={() => onOpen(`/category/${encodeURIComponent(category)}`)}><span className={`category-icon c${index}`}>{['⌘', '◇', '↗', '⊞', '♢', '⌁'][index]}</span><span><b>{category}</b><small>{tools.filter((tool) => tool.category === category).length} tools</small></span><span className="arrow">→</span></button>)}</div></>}</div>
}

function Metric({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) { return <div className="metric"><span className="metric-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{helper}</em></div></div> }
function ToolGrid({ title, tools: items, onOpen, onFavorite, favorites }: { title: string; tools: Tool[]; onOpen: (path: string, toolId?: string) => void; onFavorite: (id: string) => void; favorites: string[] }) { return <section className="tool-section">{title && <div className="section-heading"><h2>{title}</h2></div>}<div className="tool-grid">{items.map((tool) => <article className="tool-card" key={tool.id} onClick={() => onOpen(tool.path, tool.id)}><div className="card-top"><span className="tool-icon">{tool.icon}</span><button aria-label={`Favorite ${tool.name}`} className={`star ${favorites.includes(tool.id) ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onFavorite(tool.id) }}>★</button></div><h3>{tool.name}</h3><p>{tool.description}</p><div className="card-footer"><span>{tool.category}</span><span className="arrow">→</span></div></article>)}</div>{items.length === 0 && <div className="empty-state"><span>⌕</span><h3>No tools found</h3><p>Try a different search or category.</p></div>}</section> }
function History({ recent, onOpen }: { recent: string[]; onOpen: (path: string, toolId?: string) => void }) { return <div className="page"><section className="welcome"><div><p className="eyebrow">ACTIVITY</p><h1>Recent tools</h1><p className="subtitle">Your recent activity is stored locally on this device.</p></div></section><div className="history-list">{recent.length ? recent.map((id) => { const tool = tools.find((item) => item.id === id); return tool && <button key={id} onClick={() => onOpen(tool.path, tool.id)}><span className="tool-icon small">{tool.icon}</span><span><b>{tool.name}</b><small>{tool.description}</small></span><span>→</span></button> }) : <div className="empty-state"><span>◷</span><h3>No activity yet</h3><p>Open a tool to see it here.</p></div>}</div></div> }
function Settings({ theme, setTheme }: { theme: string; setTheme: (theme: 'dark' | 'light') => void }) { return <div className="page"><section className="welcome"><div><p className="eyebrow">PREFERENCES</p><h1>Settings</h1><p className="subtitle">Customize your local DevHub workspace.</p></div></section><div className="settings-card"><div><b>Appearance</b><p>Choose how DevHub looks on this device.</p></div><div className="theme-buttons"><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>☾ Dark</button><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>☼ Light</button></div></div><div className="settings-card"><div><b>Privacy</b><p>Tools run in your browser. No account or server is required for local utilities.</p></div><span className="status-pill">LOCAL ONLY</span></div></div> }
function NotFound({ onHome }: { onHome: () => void }) { return <div className="page"><div className="empty-state"><span>404</span><h3>Page not found</h3><p>The route does not exist.</p><button className="primary-button" onClick={onHome}>Back to dashboard</button></div></div> }
function Footer({ onOpen }: { onOpen: (path: string) => void }) { return <footer className="site-footer"><span>DevHub · Local-first developer tools</span><nav aria-label="Footer navigation"><button onClick={() => onOpen('/about')}>About</button><button onClick={() => onOpen('/contact')}>Contact</button><button onClick={() => onOpen('/privacy')}>Privacy</button><button onClick={() => onOpen('/terms')}>Terms</button><button onClick={() => onOpen('/disclaimer')}>Disclaimer</button><button onClick={() => onOpen('/cookies')}>Cookies & ads</button></nav></footer> }

export default App
