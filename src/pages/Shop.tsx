import { useMemo, useState } from 'react'
import DemoNotice from '../components/DemoNotice'
import ProductCard from '../components/ProductCard'
import { parrots, type SizeCategory } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import PageHeader from './PageHeader'

const filters: ('All' | SizeCategory)[] = ['All', 'Small', 'Medium', 'Large', 'Giant']

export default function Shop() {
  const [f, setF] = useState<(typeof filters)[number]>('All')
  const [sort, setSort] = useState<'featured' | 'low' | 'high'>('featured')
  const list = useMemo(() => {
    const l = parrots.filter((p) => f === 'All' || p.size === f)
    if (sort === 'low') return [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...l].sort((a, b) => b.price - a.price)
    return l
  }, [f, sort])
  useReveal([list])
  return (
    <>
      <PageHeader eyebrow="Shop parrots" title="Our feathered catalogue." text="Browse species profiles with care notes and sample prices." />
      <section className="container-x py-14">
        <DemoNotice className="mb-8" />
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by size">
            {filters.map((x) => (
              <button key={x} onClick={() => setF(x)} aria-pressed={f === x} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${f === x ? 'bg-forest text-cream' : 'bg-white text-forest hover:bg-forest/10'}`}>{x}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-forest">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-full border border-forest/15 bg-white px-4 py-2">
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  )
}
