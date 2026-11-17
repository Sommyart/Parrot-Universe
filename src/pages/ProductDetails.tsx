import { ArrowLeft, Check, HeartHandshake, Hourglass, Leaf, Minus, Plus, Ruler, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AccessoryCard from '../components/AccessoryCard'
import DemoNotice from '../components/DemoNotice'
import ProductCard from '../components/ProductCard'
import WikiImage from '../components/WikiImage'
import { useStore } from '../context/StoreContext'
import { findAccessory, findParrot, formatPrice, parrots } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import NotFound from './NotFound'

export default function ProductDetails() {
  const { id = '' } = useParams()
  const p = findParrot(id)
  const { add } = useStore()
  const [qty, setQty] = useState(1)
  useReveal([id])
  if (!p) return <NotFound />
  const related = p.relatedAccessories.map(findAccessory).filter(Boolean)
  const others = parrots.filter((x) => x.id !== p.id && x.size === p.size).concat(parrots.filter((x) => x.id !== p.id && x.size !== p.size)).slice(0, 4)

  const facts = [
    { icon: Ruler, label: 'Size category', value: `${p.size} (${p.lengthCm})` },
    { icon: Hourglass, label: 'Expected lifespan', value: p.lifespan },
    { icon: HeartHandshake, label: 'Temperament', value: p.temperament.join(', ') },
  ]

  return (
    <div className="pt-28">
      <div className="container-x">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-tropic"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>
        <DemoNotice className="mt-5" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <WikiImage title={p.wikiTitle} alt={`${p.name}, ${p.scientificName}`} accent={p.accent} className="aspect-square rounded-[2rem] shadow-xl lg:sticky lg:top-28" width={1100} credit />
          <div>
            <p className="eyebrow">{p.size} parrot</p>
            <h1 className="mt-2 text-5xl font-extrabold text-forest">{p.name}</h1>
            <p className="mt-2 text-lg italic text-charcoal/55">{p.scientificName}</p>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/75">{p.description}</p>
            <div className="mt-8 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Sample price</p>
                <p className="font-display text-4xl font-bold text-forest">{formatPrice(p.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-forest/15 bg-white">
                <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                <button className="p-3" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
              </div>
              <button className="btn-green" onClick={() => add(p.id, qty)}><ShoppingBag className="h-4 w-4" /> Add to demo cart</button>
            </div>
            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="card p-5">
                  <f.icon className="h-5 w-5 text-tropic" />
                  <dt className="mt-3 text-xs font-bold uppercase tracking-widest text-charcoal/45">{f.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-forest">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-charcoal/50">Lifespan and size figures are approximate, commonly cited ranges and vary by individual, diet and care. Please verify with an avian veterinarian.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-forest"><Leaf className="h-5 w-5 text-tropic" /> Diet</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{p.diet}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-forest">Care requirements</h2>
                <ul className="mt-3 space-y-2">
                  {p.care.map((c) => <li key={c} className="flex gap-2 text-sm text-charcoal/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-tropic" />{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20">
          <h2 className="mb-8 text-3xl font-bold text-forest">Related accessories</h2>
          <div className="grid gap-6 sm:grid-cols-3">{related.map((a) => a && <AccessoryCard key={a.id} a={a} compact />)}</div>
        </section>
        <section className="pb-24">
          <h2 className="mb-8 text-3xl font-bold text-forest">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{others.map((o) => <ProductCard key={o.id} p={o} />)}</div>
        </section>
      </div>
    </div>
  )
}
