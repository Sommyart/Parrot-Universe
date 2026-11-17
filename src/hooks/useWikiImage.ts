import { useEffect, useState } from 'react'

// Fetches a real photograph for a species from the Wikipedia REST summary API
// (images hosted on Wikimedia Commons). Results are cached in memory and sessionStorage.
const memory = new Map<string, string | null>()
const pending = new Map<string, Promise<string | null>>()

function readCache(title: string): string | null | undefined {
  if (memory.has(title)) return memory.get(title)
  try {
    const v = sessionStorage.getItem('wikiimg:' + title)
    if (v !== null) {
      const parsed = v === '' ? null : v
      memory.set(title, parsed)
      return parsed
    }
  } catch { /* storage unavailable */ }
  return undefined
}

export function fetchWikiImage(title: string, width = 900): Promise<string | null> {
  const cached = readCache(title)
  if (cached !== undefined) return Promise.resolve(cached)
  if (pending.has(title)) return pending.get(title)!
  const p = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      const thumb: string | undefined = j?.thumbnail?.source
      const orig: string | undefined = j?.originalimage?.source
      let url: string | null = null
      if (thumb && /\/\d+px-/.test(thumb)) url = thumb.replace(/\/\d+px-/, `/${width}px-`)
      else url = orig ?? thumb ?? null
      return url
    })
    .catch(() => null)
    .then((url) => {
      memory.set(title, url)
      try { sessionStorage.setItem('wikiimg:' + title, url ?? '') } catch { /* ignore */ }
      pending.delete(title)
      return url
    })
  pending.set(title, p)
  return p
}

export function useWikiImage(title: string | undefined, width = 900) {
  const [src, setSrc] = useState<string | null | undefined>(() => (title ? readCache(title) : null))
  useEffect(() => {
    if (!title) return
    let alive = true
    fetchWikiImage(title, width).then((u) => alive && setSrc(u))
    return () => { alive = false }
  }, [title, width])
  return src // undefined = loading, null = failed
}
