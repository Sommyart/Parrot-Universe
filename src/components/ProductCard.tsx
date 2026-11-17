import { ArrowUpRight, Plus, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice, type Parrot } from '../data/products'
import WikiImage from './WikiImage'

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-6px)`
  el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
  el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.transform = ''
}

export default function ProductCard({ p }: { p: Parrot }) {
  const { add } = useStore()
  return (
    <article onPointerMove={tilt} onPointerLeave={untilt} className="card group reveal relative flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_30px_60px_-30px_rgba(18,61,43,.55)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.35), transparent 45%)' }} />
      <Link to={`/parrots/${p.id}`} className="relative block aspect-[4/3.4]" aria-label={`View ${p.name}`}>
        <WikiImage title={p.wikiTitle} alt={`${p.name} (${p.scientificName})`} accent={p.accent} className="h-full w-full" imgClassName="group-hover:scale-105" width={700} />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-forest backdrop-blur"><Ruler className="h-3 w-3" />{p.size}</span>
        <span className="absolute right-3 top-3 rounded-full bg-forest/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">Sample</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-forest">{p.name}</h3>
        <p className="mt-0.5 text-xs italic text-charcoal/55">{p.scientificName}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/75">{p.short}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/45">Sample price</p>
            <p className="font-display text-2xl font-bold text-forest">{formatPrice(p.price)}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
          <Link to={`/parrots/${p.id}`} className="btn border border-forest/15 !px-3 !py-2.5 text-sm text-forest hover:border-forest">Details <ArrowUpRight className="h-4 w-4" /></Link>
          <button onClick={() => add(p.id)} className="btn-green !px-3 !py-2.5 text-sm"><Plus className="h-4 w-4" /> <span className="whitespace-nowrap">Add to Cart</span></button>
        </div>
      </div>
    </article>
  )
}
