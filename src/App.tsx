import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { categories, tools } from './config/tools'
import { navigate, parseRoute, type AppRoute } from './lib/router'
import { useStored } from './lib/storage'
import type { Tool } from './types/tools'
import { ToolView } from './components/ToolView'
import { AdSlot } from './components/AdSlot'
import { InfoPage } from './components/InfoPage'

const siteOrigin = 'https://dev-hub-nu-nine.vercel.app'

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
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false); if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector<HTMLInputElement>('.search input')?.focus() } }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const activeTool = route.kind === 'tool' ? tools.find((tool) => tool.id === route.toolId) : undefined
  const activeCategory = route.kind === 'category' ? route.category : undefined
  useEffect(() => {
    let title = 'DevHub — Free Online Developer Tools'
    let description = 'Use practical browser-based developer tools for JSON, encoding, APIs, data, web development, and DevOps.'

    if (activeTool) {
      title = `${activeTool.name} | DevHub`
      description = activeTool.description
    } else if (route.kind === 'category') {
      title = `${route.category} Tools | DevHub`
      description = `Browse DevHub's browser-based ${route.category.toLowerCase()} tools, with practical examples and usage notes.`
    } else if (route.kind === 'info') {
      const infoSeo: Record<string, { title: string; description: string }> = {
        about: { title: 'About DevHub', description: 'Learn what DevHub provides, how its browser-based developer tools work, and what the project does not do.' },
        contact: { title: 'Contact DevHub', description: 'Find the public support and issue-reporting channel for DevHub.' },
        privacy: { title: 'Privacy Policy | DevHub', description: 'Understand DevHub browser storage, local processing, advertising scripts, and privacy choices.' },
        terms: { title: 'Terms of Use | DevHub', description: 'Read the terms and responsible-use guidance for DevHub developer utilities.' },
        disclaimer: { title: 'Disclaimer | DevHub', description: 'Understand the limitations of DevHub utility outputs and why important results need verification.' },
        cookies: { title: 'Cookies & Advertising | DevHub', description: 'Learn about browser storage, Google advertising technologies, and consent choices on DevHub.' },
      }
      title = infoSeo[route.page].title
      description = infoSeo[route.page].description
    } else if (route.kind === 'favorites') {
      title = 'Saved Tools | DevHub'
      description = 'Your locally saved DevHub developer tools.'
    } else if (route.kind === 'history') {
      title = 'Recently Used Tools | DevHub'
      description = 'Your recent DevHub tool activity on this browser.'
    } else if (route.kind === 'settings') {
      title = 'Settings | DevHub'
      description = 'Manage local appearance preferences for DevHub.'
    } else if (route.kind === 'not-found') {
      title = 'Page Not Found | DevHub'
      description = 'The requested DevHub page could not be found.'
    }

    document.title = title
    const setMeta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.content = value
    }

    const canonical = `${siteOrigin}${window.location.pathname}`
    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

    setMeta('name', 'description', description)
    setMeta('name', 'robots', ['favorites', 'history', 'settings', 'not-found'].includes(route.kind) ? 'noindex,follow' : 'index,follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
  }, [activeTool?.name, activeTool?.description, route])
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
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><b>{activeTool?.name ?? (route.kind === 'dashboard' ? 'Dashboard' : route.kind)}</b></div><div className="top-actions"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." /></label><button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☼' : '☾'}</button><button className="help-button" aria-label="Contact DevHub" onClick={() => open('/contact')}>?</button><div className="profile" aria-label="DevHub">D</div></div></header>
      {activeTool ? <ToolView tool={activeTool} onBack={() => open('/')} /> : dashboard ? <Dashboard tools={visibleTools} recent={recent} favorites={favorites} onOpen={open} onFavorite={toggleFavorite} query={query} pageMode={route.kind === 'favorites' ? 'favorites' : route.kind === 'category' ? 'category' : 'dashboard'} /> : route.kind === 'history' ? <History recent={recent} onOpen={open} /> : route.kind === 'settings' ? <Settings theme={theme} setTheme={setTheme} /> : route.kind === 'info' ? <InfoPage page={route.page} /> : <NotFound onHome={() => open('/')} />}
      <Footer onOpen={open} />
    </main>
  </div>
}

function Sidebar({ route, favorites, onOpen, isOpen, onClose }: { route: AppRoute; favorites: number; onOpen: (path: string) => void; isOpen: boolean; onClose: () => void }) {
  return <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} aria-label="Application navigation"><div className="brand"><span className="brand-mark">D</span><span>DevHub</span><button className="mobile-close" aria-label="Close navigation" onClick={onClose}>×</button></div><div className="workspace-switcher"><span className="avatar">D</span><span><b>Browser workspace</b><small>No account required</small></span></div><nav aria-label="Primary navigation"><p className="nav-label">Workspace</p><NavButton icon="⌂" label="Dashboard" active={route.kind === 'dashboard'} onClick={() => onOpen('/')} /><NavButton icon="⌕" label="Discover tools" active={route.kind === 'category' && !route.category} onClick={() => onOpen('/')} /><NavButton icon="▣" label="Code Studio" active={route.kind === 'category' && route.category === 'Code Engineering'} onClick={() => onOpen('/category/Code%20Engineering')} /><NavButton icon="⌁" label="API Workspace" active={route.kind === 'category' && route.category === 'API Workspace'} onClick={() => onOpen('/category/API%20Workspace')} /><p className="nav-label">Library</p><NavButton icon="★" label="Favorites" active={route.kind === 'favorites'} onClick={() => onOpen('/favorites')} count={favorites} /><NavButton icon="◷" label="History" active={route.kind === 'history'} onClick={() => onOpen('/history')} /><NavButton icon="ⓘ" label="About DevHub" active={route.kind === 'info' && route.page === 'about'} onClick={() => onOpen('/about')} /></nav><div className="sidebar-bottom"><NavButton icon="⚙" label="Settings" active={route.kind === 'settings'} onClick={() => onOpen('/settings')} /><div className="sidebar-note"><b>Local-first tools</b><p>Everyday transformations run in your browser. No DevHub account is required.</p></div><small className="version">DevHub v0.2.0 · Local mode</small></div></aside>
}

function NavButton({ icon, label, active, onClick, count }: { icon: string; label: string; active: boolean; onClick: () => void; count?: number }) { return <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}><span>{icon}</span>{label}{count ? <em>{count}</em> : null}</button> }

function Dashboard({ tools: visibleTools, recent, favorites, onOpen, onFavorite, query, pageMode }: { tools: Tool[]; recent: string[]; favorites: string[]; onOpen: (path: string, toolId?: string) => void; onFavorite: (id: string) => void; query: string; pageMode: 'dashboard' | 'favorites' | 'category' }) {
  const recentTools = recent.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as Tool[]
  const sectionTitle = pageMode === 'favorites' ? 'Saved tools' : pageMode === 'category' ? 'Tools in this category' : 'All developer tools'

  return (
    <div className="page">
      {pageMode === 'dashboard' ? (
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR DEVELOPER WORKSPACE</p>
            <h1>Welcome to DevHub <span>✦</span></h1>
            <p className="subtitle">A practical workspace for everyday development tasks.</p>
          </div>
          <button className="primary-button" onClick={() => document.querySelector<HTMLInputElement>('.search input')?.focus()}>⌕ <span>Find a tool</span><kbd>⌘ K</kbd></button>
        </section>
      ) : (
        <section className="welcome">
          <div>
            <p className="eyebrow">{pageMode === 'favorites' ? 'YOUR LIBRARY' : 'TOOL CATEGORY'}</p>
            <h1>{pageMode === 'favorites' ? 'Saved tools' : 'Explore developer tools'}</h1>
            <p className="subtitle">{pageMode === 'favorites' ? 'Your favorites are stored locally in this browser.' : 'Choose a tool to open its editor, guide, and examples.'}</p>
          </div>
        </section>
      )}

      {pageMode === 'dashboard' && <AdSlot slot={import.meta.env.VITE_ADSENSE_HEADER_SLOT as string | undefined} />}

      {pageMode === 'dashboard' && (
        <section className="metrics">
          <Metric icon="⌘" label="Available tools" value={`${tools.length}`} helper="across six categories" />
          <Metric icon="★" label="Favorites" value={`${favorites.length}`} helper="saved in this browser" />
          <Metric icon="◷" label="Recently used" value={`${recent.length}`} helper="your recent tools" />
          <Metric icon="◈" label="Processing" value="Browser" helper="no DevHub account required" />
        </section>
      )}

      {query ? (
        <ToolGrid title={`Search results for “${query}”`} tools={visibleTools} onOpen={onOpen} onFavorite={onFavorite} favorites={favorites} />
      ) : (
        <>
          <section className="section-heading">
            <div>
              <h2>{sectionTitle}</h2>
              <p>{pageMode === 'favorites' ? 'Open a saved tool or remove it from your favorites.' : 'Open a tool to see instructions, examples, and practical limitations.'}</p>
            </div>
          </section>
          <ToolGrid title="" tools={visibleTools} onOpen={onOpen} onFavorite={onFavorite} favorites={favorites} />

          {pageMode === 'dashboard' && recentTools.length > 0 && (
            <>
              <section className="section-heading"><div><h2>Continue working</h2><p>Pick up where you left off.</p></div></section>
              <div className="recent-row">
                {recentTools.map((tool) => <button className="recent-card" key={tool.id} onClick={() => onOpen(tool.path, tool.id)}><span className="tool-icon small">{tool.icon}</span><span><b>{tool.name}</b><small>{tool.category}</small></span><span className="arrow">→</span></button>)}
              </div>
            </>
          )}

          {pageMode !== 'favorites' && (
            <>
              <section className="section-heading category-heading"><div><h2>Explore by category</h2><p>Find the right tool for every engineering task.</p></div></section>
              <div className="category-grid">
                {categories.map((category, index) => <button key={category} onClick={() => onOpen(`/category/${encodeURIComponent(category)}`)}><span className={`category-icon c${index}`}>{['⌘', '◇', '↗', '⊞', '♢', '⌁'][index]}</span><span><b>{category}</b><small>{tools.filter((tool) => tool.category === category).length} tools</small></span><span className="arrow">→</span></button>)}
              </div>
            </>
          )}
          {pageMode === 'dashboard' && <HomeContent />}
        </>
      )}
    </div>
  )
}

function HomeContent() {
  return <section className="home-content">
    <div className="home-content-intro">
      <p className="eyebrow">ABOUT THE WORKSPACE</p>
      <h2>Small developer tasks, in one practical place</h2>
      <p>DevHub brings everyday formatting, conversion, testing, and reference tasks into a single browser workspace. The tools are intended to make common checks quicker without requiring an account or sending ordinary tool input to a DevHub application server.</p>
    </div>
    <div className="home-faq-grid">
      <section><h3>What can I do here?</h3><p>Format JSON, test regular expressions, encode text, convert CSV and YAML, inspect timestamps, work with colors, preview Markdown, format SQL and XML, and look up common HTTP and cron details.</p></section>
      <section><h3>Is my input uploaded?</h3><p>DevHub's ordinary transformations run in browser code. The app does not submit those inputs to a DevHub backend. Third-party browser scripts, advertising technologies, and external resources have separate data practices.</p></section>
      <section><h3>Do I need an account?</h3><p>No DevHub account is required. Theme, favorites, and recent tool IDs are stored locally in this browser. Clearing site data removes those preferences.</p></section>
      <section><h3>Can I use the output in production?</h3><p>Use the output as a starting point and verify it in the target language, framework, database, or deployment environment. Formatting and conversion tools do not replace testing or security review.</p></section>
    </div>
  </section>
}

function Metric({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) { return <div className="metric"><span className="metric-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{helper}</em></div></div> }
function ToolGrid({ title, tools: items, onOpen, onFavorite, favorites }: { title: string; tools: Tool[]; onOpen: (path: string, toolId?: string) => void; onFavorite: (id: string) => void; favorites: string[] }) { return <section className="tool-section">{title && <div className="section-heading"><h2>{title}</h2></div>}<div className="tool-grid">{items.map((tool) => <article className="tool-card" key={tool.id} onClick={() => onOpen(tool.path, tool.id)}><div className="card-top"><span className="tool-icon">{tool.icon}</span><button aria-label={`Favorite ${tool.name}`} className={`star ${favorites.includes(tool.id) ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onFavorite(tool.id) }}>★</button></div><h3>{tool.name}</h3><p>{tool.description}</p><div className="card-footer"><span>{tool.category}</span><span className="arrow">→</span></div></article>)}</div>{items.length === 0 && <div className="empty-state"><span>⌕</span><h3>No tools found</h3><p>Try a different search or category.</p></div>}</section> }
function History({ recent, onOpen }: { recent: string[]; onOpen: (path: string, toolId?: string) => void }) { return <div className="page"><section className="welcome"><div><p className="eyebrow">ACTIVITY</p><h1>Recent tools</h1><p className="subtitle">Your recent activity is stored locally on this device.</p></div></section><div className="history-list">{recent.length ? recent.map((id) => { const tool = tools.find((item) => item.id === id); return tool && <button key={id} onClick={() => onOpen(tool.path, tool.id)}><span className="tool-icon small">{tool.icon}</span><span><b>{tool.name}</b><small>{tool.description}</small></span><span>→</span></button> }) : <div className="empty-state"><span>◷</span><h3>No activity yet</h3><p>Open a tool to see it here.</p></div>}</div></div> }
function Settings({ theme, setTheme }: { theme: string; setTheme: (theme: 'dark' | 'light') => void }) { return <div className="page"><section className="welcome"><div><p className="eyebrow">PREFERENCES</p><h1>Settings</h1><p className="subtitle">Customize your local DevHub workspace.</p></div></section><div className="settings-card"><div><b>Appearance</b><p>Choose how DevHub looks on this device.</p></div><div className="theme-buttons"><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>☾ Dark</button><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>☼ Light</button></div></div><div className="settings-card"><div><b>Privacy</b><p>Tools run in your browser. No account or server is required for local utilities.</p></div><span className="status-pill">LOCAL ONLY</span></div></div> }
function NotFound({ onHome }: { onHome: () => void }) { return <div className="page"><div className="empty-state"><span>404</span><h3>Page not found</h3><p>The route does not exist.</p><button className="primary-button" onClick={onHome}>Back to dashboard</button></div></div> }
function Footer({ onOpen }: { onOpen: (path: string) => void }) { return <footer className="site-footer"><span>DevHub · Local-first developer tools</span><nav aria-label="Footer navigation"><button onClick={() => onOpen('/about')}>About</button><button onClick={() => onOpen('/contact')}>Contact</button><button onClick={() => onOpen('/privacy')}>Privacy</button><button onClick={() => onOpen('/terms')}>Terms</button><button onClick={() => onOpen('/disclaimer')}>Disclaimer</button><button onClick={() => onOpen('/cookies')}>Cookies & ads</button></nav></footer> }

export default App
