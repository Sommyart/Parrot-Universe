import { Apple, Bone, Grid3x3, Plus, Soup, Sparkles, TreePine } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { formatPrice, type Accessory } from '../data/products'

const icons = { cage: Grid3x3, stand: TreePine, toy: Bone, food: Apple, bowl: Soup, groom: Sparkles }

export default function AccessoryCard({ a, compact = false }: { a: Accessory; compact?: boolean }) {
  const { add } = useStore()
  const Icon = icons[a.icon]
  const [photo, setPhoto] = useState(true)
  return (
    <article className="card group reveal flex flex-col overflow-hidden transition duration-500 hover:-translate-y-1">
      <div className={`relative grid place-items-center bg-gradient-to-br ${a.tone} ${compact ? 'h-32' : 'h-44'}`}>
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
        {photo && <img src={`/img/accessories/${a.id}.jpg`} alt={a.name} loading="lazy" onError={() => setPhoto(false)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
        <Icon className={`${photo ? 'hidden' : ''} h-14 w-14 text-white drop-shadow-lg transition duration-500 group-hover:rotate-6 group-hover:scale-110`} strokeWidth={1.5} />
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-forest">{a.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-forest">{a.name}</h3>
        <p className="mt-2 flex-1 text-sm text-charcoal/70">{a.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-forest">{formatPrice(a.price)}</span>
          <button onClick={() => add(a.id)} className="btn-green !px-4 !py-2 text-sm" aria-label={`Add ${a.name} to cart`}><Plus className="h-4 w-4" /> Add</button>
        </div>
      </div>
    </article>
  )
}
