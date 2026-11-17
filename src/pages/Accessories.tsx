import AccessoryCard from '../components/AccessoryCard'
import { accessories } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import PageHeader from './PageHeader'

export default function Accessories() {
  useReveal()
  const cats = [...new Set(accessories.map((a) => a.category))]
  return (
    <>
      <PageHeader eyebrow="Accessories" title="Bird-safe essentials." text="Cages, stands, toys, premium food, feeding bowls and grooming accessories. Sample products for this demonstration store." />
      <section className="container-x py-14">
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Categories">
          {cats.map((c) => <a key={c} href={`#${c.replace(/\s/g, '-')}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-cream">{c}</a>)}
        </nav>
        {cats.map((c) => (
          <div key={c} id={c.replace(/\s/g, '-')} className="mb-14 scroll-mt-28">
            <h2 className="mb-6 text-3xl font-bold text-forest">{c}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accessories.filter((a) => a.category === c).map((a) => <AccessoryCard key={a.id} a={a} />)}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
