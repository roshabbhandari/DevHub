import { useEffect, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined

export function AdSlot({ slot, label = 'Advertisement' }: { slot: string | undefined; label?: string }) {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!clientId || !slot) return
    const existing = document.querySelector<HTMLScriptElement>('script[data-devhub-adsense]')
    if (!existing) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`
      script.crossOrigin = 'anonymous'
      script.dataset.devhubAdsense = 'true'
      script.onerror = () => setBlocked(true)
      document.head.appendChild(script)
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? []
      window.adsbygoogle.push({})
    } catch {
      queueMicrotask(() => setBlocked(true))
    }
  }, [slot])

  if (!clientId || !slot) return null

  return <aside className={`ad-slot ${blocked ? 'ad-blocked' : ''}`} aria-label={label}>
    {blocked ? <p>Ads are unavailable. You can continue using DevHub normally.</p> : <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={clientId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />}
  </aside>
}
