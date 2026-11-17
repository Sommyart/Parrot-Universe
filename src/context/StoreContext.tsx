import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { findItem } from '../data/products'

export interface CartLine { id: string; qty: number }

interface StoreValue {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (id: string, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  toast: string | null
  parrotEnabled: boolean
  setParrotEnabled: (v: boolean) => void
}

const StoreContext = createContext<StoreValue | null>(null)
const CART_KEY = 'parrot-universe:cart'
const PARROT_KEY = 'parrot-universe:parrot-enabled'

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load<CartLine[]>(CART_KEY, []).filter((l) => findItem(l.id)))
  const [parrotEnabled, setParrotEnabled] = useState<boolean>(() => load(PARROT_KEY, true))
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(lines)) } catch { /* ignore */ } }, [lines])
  useEffect(() => { try { localStorage.setItem(PARROT_KEY, JSON.stringify(parrotEnabled)) } catch { /* ignore */ } }, [parrotEnabled])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo<StoreValue>(() => {
    const subtotal = lines.reduce((s, l) => s + (findItem(l.id)?.price ?? 0) * l.qty, 0)
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      add: (id, qty = 1) => {
        setLines((prev) => {
          const ex = prev.find((l) => l.id === id)
          return ex ? prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l)) : [...prev, { id, qty }]
        })
        setToast(`${findItem(id)?.name ?? 'Item'} added to your demo cart`)
        const cheers = ['Great choice!', 'Ooh, lovely!', 'Into the cart!', 'Squawk! Nice pick!']
        window.dispatchEvent(new CustomEvent('parrot:cheer', { detail: cheers[Math.floor(Math.random() * cheers.length)] }))
      },
      remove: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      setQty: (id, qty) => setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)))),
      clear: () => setLines([]),
      toast,
      parrotEnabled,
      setParrotEnabled,
    }
  }, [lines, toast, parrotEnabled])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
