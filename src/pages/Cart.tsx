import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import DemoNotice from '../components/DemoNotice'
import WikiImage from '../components/WikiImage'
import { useStore } from '../context/StoreContext'
import { findItem, findParrot, formatPrice } from '../data/products'

export const SHIPPING_FLAT = 25
export const TAX_RATE = 0.0725 // sample estimate only

export function totals(subtotal: number) {
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  return { shipping, tax, total: subtotal + shipping + tax }
}

export default function Cart() {
  const { lines, subtotal, setQty, remove, clear } = useStore()
  const t = totals(subtotal)
  return (
    <div className="container-x pb-24 pt-32">
      <h1 className="text-5xl font-extrabold text-forest">Your cart</h1>
      <DemoNotice className="mt-6" text="This is a demonstration cart. No live animals are offered for sale and no order or payment will be processed." />
      {lines.length === 0 ? (
        <div className="card mt-10 grid place-items-center px-6 py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-cream"><ShoppingBag className="h-9 w-9 text-tropic" /></span>
          <h2 className="mt-6 text-3xl font-bold text-forest">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-charcoal/65">Ruby is waiting on her perch. Explore the flock or pick up some accessories.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-green">Explore Parrots</Link>
            <Link to="/accessories" className="btn border border-forest/20 text-forest">Accessories</Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="space-y-4">
            {lines.map((l) => {
              const item = findItem(l.id)!
              const parrot = findParrot(l.id)
              return (
                <li key={l.id} className="card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                  {parrot ? (
                    <WikiImage title={parrot.wikiTitle} alt="" className="h-24 w-24 shrink-0 rounded-2xl" width={200} />
                  ) : (
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-tropic to-forest text-xs font-bold text-cream">Accessory</div>
                  )}
                  <div className="min-w-0 flex-1">
                    {parrot ? <Link to={`/parrots/${parrot.id}`} className="text-lg font-bold text-forest hover:text-tropic">{item.name}</Link> : <p className="text-lg font-bold text-forest">{item.name}</p>}
                    <p className="text-sm text-charcoal/55">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center rounded-full border border-forest/15 bg-white">
                    <button className="p-2.5" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Decrease ${item.name}`}><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center font-bold">{l.qty}</span>
                    <button className="p-2.5" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Increase ${item.name}`}><Plus className="h-4 w-4" /></button>
                  </div>
                  <p className="w-24 text-right font-display text-xl font-bold text-forest">{formatPrice(item.price * l.qty)}</p>
                  <button onClick={() => remove(l.id)} className="rounded-full p-2.5 text-charcoal/50 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${item.name}`}><Trash2 className="h-4 w-4" /></button>
                </li>
              )
            })}
            <button onClick={clear} className="text-sm font-semibold text-charcoal/50 underline hover:text-red-600">Clear cart</button>
          </ul>
          <aside className="card h-fit p-7 lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold text-forest">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping (sample flat rate)</dt><dd className="font-semibold">{formatPrice(t.shipping)}</dd></div>
              <div className="flex justify-between"><dt>Estimated tax (sample 7.25%)</dt><dd className="font-semibold">{t.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</dd></div>
              <div className="flex justify-between border-t border-forest/10 pt-4 text-lg"><dt className="font-bold text-forest">Estimated total</dt><dd className="font-display text-2xl font-bold text-forest">{t.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</dd></div>
            </dl>
            <Link to="/checkout" className="btn-gold mt-7 w-full">Demo checkout <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      )}
    </div>
  )
}
