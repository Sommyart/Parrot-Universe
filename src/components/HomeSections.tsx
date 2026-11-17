import { ArrowRight, BookOpen, Clock, HeartPulse, Microscope, PackageCheck, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { articles, speciesGroups } from '../data/content'
import { accessories, parrots } from '../data/products'
import AccessoryCard from './AccessoryCard'
import ProductCard from './ProductCard'
import WikiImage from './WikiImage'

export function SectionHead({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-4xl font-bold text-forest sm:text-5xl">{title}</h2>
        {text && <p className="mt-4 text-lg leading-relaxed text-charcoal/70">{text}</p>}
      </div>
      {action}
    </div>
  )
}

export function FeaturedParrots() {
  return (
    <section id="featured" className="container-x py-24">
      <SectionHead
        eyebrow="Featured parrots"
        title="Meet the flock."
        text="Eight remarkable species, from pocket-sized conures to majestic macaws. A demonstration catalogue: no live animals are sold."
        action={<Link to="/shop" className="btn border border-forest/20 text-forest hover:border-forest">View all <ArrowRight className="h-4 w-4" /></Link>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {parrots.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}

const features = [
  { icon: Microscope, title: 'Carefully Researched Species Information', text: 'Clear profiles covering size, temperament, diet and care so you can compare species honestly.' },
  { icon: HeartPulse, title: 'Bird Wellness and Care Resources', text: 'Practical guides on enrichment, nutrition and spotting early signs that a bird needs a vet.' },
  { icon: PackageCheck, title: 'Quality Bird Accessories', text: 'Cages, stands, toys and bowls chosen with bird-safe materials and real parrot behaviour in mind.' },
  { icon: Sprout, title: 'Responsible Companion Bird Education', text: 'We put lifespan, noise and time commitment front and centre, because parrots are a lifelong choice.' },
]

export function WhyChooseUs() {
  return (
    <section className="bg-forest py-24 text-cream">
      <div className="container-x">
        <div className="reveal mb-14 max-w-2xl">
          <p className="eyebrow !text-gold">Why choose us</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">A store built around the birds.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={f.title} className="reveal group rounded-3xl border border-white/10 bg-white/[.04] p-7 transition duration-500 hover:-translate-y-1 hover:bg-white/[.08]">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-forest transition group-hover:rotate-6"><f.icon className="h-6 w-6" /></span>
                <span className="font-display text-3xl font-bold text-white/10">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold leading-snug">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SpeciesSection() {
  return (
    <section className="container-x py-24">
      <SectionHead eyebrow="Explore parrot species" title="Find the right size for your life." text="Size shapes almost everything: space, noise, diet and lifespan. Here is a quick guide to the four broad groups." />
      <div className="grid gap-6 md:grid-cols-2">
        {speciesGroups.map((g, i) => (
          <article key={g.title} className={`reveal card group grid overflow-hidden sm:grid-cols-[1fr_1.1fr] ${i % 2 ? 'md:translate-y-10' : ''}`}>
            <WikiImage title={g.wikiTitle} alt={g.title} className="aspect-[4/3] sm:aspect-auto sm:min-h-64" imgClassName="group-hover:scale-105" credit width={600} />
            <div className="flex flex-col justify-center p-7">
              <span className="text-xs font-bold uppercase tracking-widest text-tropic">{String(i + 1).padStart(2, '0')} / {['Small', 'Medium', 'Large', 'Giant'][i]}</span>
              <h3 className="mt-2 text-2xl font-bold text-forest">{g.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{g.text}</p>
              <p className="mt-4 text-xs font-semibold text-charcoal/50">e.g. {g.examples}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function AccessoriesSection({ limit = 6 }: { limit?: number }) {
  return (
    <section className="bg-[#f6eedb] py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Accessories"
          title="Everything for a happy flock."
          text="Cages, stands, toys, premium food, feeding bowls and grooming essentials. Sample products for this demo store."
          action={<Link to="/accessories" className="btn border border-forest/20 text-forest hover:border-forest">All accessories <ArrowRight className="h-4 w-4" /></Link>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accessories.slice(0, limit).map((a) => <AccessoryCard key={a.id} a={a} />)}
        </div>
      </div>
    </section>
  )
}

export function EducationalSection() {
  const [lead, ...rest] = articles
  return (
    <section id="learn" className="container-x py-24">
      <SectionHead eyebrow="Parrot academy" title="Everything You Need to Know About Parrots." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Link to={`/learn/${lead.slug}`} className="reveal card group relative min-h-[420px] overflow-hidden">
          <WikiImage title={lead.wikiTitle} alt="" className="absolute inset-0" imgClassName="group-hover:scale-105" width={1000} />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-forest"><BookOpen className="h-3.5 w-3.5" /> Featured guide</span>
            <h3 className="mt-4 text-3xl font-bold">{lead.title}</h3>
            <p className="mt-2 max-w-md text-cream/80">{lead.summary}</p>
          </div>
        </Link>
        <div className="grid gap-4">
          {rest.map((a) => (
            <Link key={a.slug} to={`/learn/${a.slug}`} className="reveal card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
              <WikiImage title={a.wikiTitle} alt="" className="h-20 w-20 shrink-0 rounded-2xl" width={200} />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-forest group-hover:text-tropic">{a.title}</h3>
                <p className="line-clamp-1 text-sm text-charcoal/65">{a.summary}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-charcoal/45"><Clock className="h-3 w-3" /> {a.minutes} min read</span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-forest/40 transition group-hover:translate-x-1 group-hover:text-tropic" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
