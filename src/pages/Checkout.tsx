import { CheckCircle2, Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import DemoNotice from '../components/DemoNotice'
import { useStore } from '../context/StoreContext'
import { findItem, formatPrice } from '../data/products'
import { totals } from './Cart'

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export default function Checkout() {
  const { lines, subtotal, clear } = useStore()
  const [placed, setPlaced] = useState<string | null>(null)
  const t = totals(subtotal)
  if (!placed && lines.length === 0) return <Navigate to="/cart" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setPlaced('PU-DEMO-' + Math.floor(100000 + Math.random() * 900000))
    clear()
    window.scrollTo({ top: 0 })
  }

  if (placed)
    return (
      <div className="container-x grid min-h-[70vh] place-items-center pb-24 pt-32">
        <div className="card max-w-lg p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-tropic" />
          <h1 className="mt-5 text-4xl font-extrabold text-forest">Demo order complete</h1>
          <p className="mt-3 text-charcoal/70">Sample reference <strong>{placed}</strong>.</p>
          <DemoNotice className="mt-6 text-left" text="No actual order was placed and no payment was taken. This website is a demonstration and does not sell animals." />
          <Link to="/" className="btn-green mt-8">Back to home</Link>
        </div>
      </div>
    )

  const field = 'w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 outline-none focus:border-tropic'
  return (
    <div className="container-x pb-24 pt-32">
      <h1 className="text-5xl font-extrabold text-forest">Demo checkout</h1>
      <DemoNotice className="mt-6" text="Demonstration only: no actual order or payment will be processed. Sample details are pre-filled and no payment data is collected." />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="card space-y-8 p-7">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-4 text-2xl font-bold text-forest">Contact & delivery</legend>
            <input className={field} defaultValue="Jamie Example" aria-label="Full name" required />
            <input className={field} type="email" defaultValue="jamie@example.com" aria-label="Email" required />
            <input className={`${field} sm:col-span-2`} defaultValue="42 Sample Street" aria-label="Address" required />
            <input className={field} defaultValue="Parrot Bay, CA" aria-label="City" required />
            <input className={field} defaultValue="90210" aria-label="ZIP code" required />
          </fieldset>
          <fieldset>
            <legend className="mb-4 text-2xl font-bold text-forest">Payment</legend>
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-forest/30 bg-cream p-5 text-sm text-charcoal/70">
              <Lock className="h-5 w-5 text-tropic" /> Payment processing is disabled in this demonstration. No card details are requested.
            </div>
          </fieldset>
          <button type="submit" className="btn-gold w-full">Place demo order ({money(t.total)})</button>
        </form>
        <aside className="card h-fit p-7">
          <h2 className="text-2xl font-bold text-forest">Sample order details</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {lines.map((l) => {
              const i = findItem(l.id)!
              return <li key={l.id} className="flex justify-between gap-3"><span>{i.name} × {l.qty}</span><span className="font-semibold">{formatPrice(i.price * l.qty)}</span></li>
            })}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-forest/10 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{money(t.shipping)}</dd></div>
            <div className="flex justify-between"><dt>Est. tax</dt><dd>{money(t.tax)}</dd></div>
            <div className="flex justify-between pt-2 text-lg font-bold text-forest"><dt>Estimated total</dt><dd>{money(t.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
