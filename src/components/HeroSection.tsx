import gsap from 'gsap'
import { ArrowRight, MousePointer2, Hand } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import WikiImage from './WikiImage'

function Leaf({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 200 400" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path d="M100 400 C 98 300 96 200 100 10" stroke="currentColor" strokeWidth="3" fill="none" />
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 40 + i * 38
        const w = 40 + Math.sin((i / 8) * Math.PI) * 55
        return (
          <g key={i}>
            <path d={`M100 ${y + 20} Q ${100 - w} ${y} ${100 - w - 10} ${y - 18} Q ${100 - w / 2} ${y + 4} 100 ${y + 20}`} fill="currentColor" />
            <path d={`M100 ${y + 10} Q ${100 + w} ${y - 10} ${100 + w + 10} ${y - 28} Q ${100 + w / 2} ${y - 6} 100 ${y + 10}`} fill="currentColor" />
          </g>
        )
      })}
    </svg>
  )
}

export default function HeroSection() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-in]', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 })
      gsap.from('[data-hero-card]', { y: 60, opacity: 0, rotate: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', delay: 0.5 })
      gsap.to('[data-leaf]', { rotate: 3, transformOrigin: '50% 100%', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.8 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative isolate min-h-[100svh] overflow-hidden bg-forest text-cream">
      <div className="leaf-pattern absolute inset-0 -z-10" />
      <Leaf className="absolute -left-16 bottom-0 -z-10 h-[70vh] text-tropic/25" />
      <div data-leaf className="absolute -right-10 -top-10 -z-10 h-[55vh] text-tropic/20"><Leaf className="h-full rotate-180" flip /></div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/25 to-transparent" />

      <div className="container-x grid min-h-[100svh] items-center gap-6 pb-10 pt-28 lg:grid-cols-[1.05fr_1fr] lg:pb-0 lg:pt-20">
        <div className="relative z-10 max-w-xl">
          <p data-hero-in className="mb-5 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-gold" /> Discover the Colourful World of Parrots
          </p>
          <h1 data-hero-in className="text-5xl font-extrabold leading-[0.95] sm:text-6xl xl:text-[5.4rem]">
            Bring Home a <span className="italic text-gold">Little</span> Colour.
          </h1>
          <p data-hero-in className="mt-6 max-w-md text-lg leading-relaxed text-cream/75">
            Discover beautiful companion parrots, explore fascinating species and find your perfect feathered friend.
          </p>
          <div data-hero-in className="mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-gold">Explore Our Parrots <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/about" className="btn-ghost text-cream">Discover Our Story</Link>
          </div>
          <p data-hero-in className="mt-10 hidden items-center gap-2 text-sm text-cream/55 sm:flex">
            <MousePointer2 className="h-4 w-4 text-gold" /> Meet Ruby, our Scarlet Macaw. Move your cursor close to her perch.
          </p>
          <p data-hero-in className="mt-8 flex items-center gap-2 text-sm text-cream/55 sm:hidden">
            <Hand className="h-4 w-4 text-gold" /> Tap Ruby, our Scarlet Macaw, to see her fly.
          </p>
        </div>

        {/* Parrot perch area: the AnimatedParrot aligns itself to #parrot-perch */}
        <div className="relative h-[46vh] min-h-[320px] lg:h-[78vh]">
          <div className="absolute left-1/2 top-[52%] -z-0 aspect-square w-[min(88%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,249,236,.20),rgba(242,189,69,.10)_45%,transparent_70%)]" />
          <div data-hero-card className="absolute right-0 top-[4%] hidden w-40 rotate-6 overflow-hidden rounded-3xl border-4 border-cream/90 shadow-2xl md:block xl:w-48">
            <WikiImage title="Blue-and-yellow_macaw" alt="Blue-and-gold macaw" className="aspect-[3/4]" width={400} />
          </div>
          <div data-hero-card className="absolute bottom-[14%] right-[2%] hidden w-36 -rotate-6 overflow-hidden rounded-3xl border-4 border-cream/90 shadow-2xl lg:block xl:w-44">
            <WikiImage title="Sun_parakeet" alt="Sun conure" className="aspect-square" width={400} />
          </div>
          <div data-hero-card className="absolute left-0 top-[10%] hidden w-32 -rotate-3 overflow-hidden rounded-3xl border-4 border-cream/90 shadow-2xl xl:block">
            <WikiImage title="Grey_parrot" alt="African grey parrot" className="aspect-[4/5]" width={400} />
          </div>
          <div id="parrot-perch" className="absolute bottom-[6%] left-[46%] h-10 w-40 -translate-x-1/2" aria-hidden="true">
            <div className="absolute inset-x-0 bottom-0 h-6 rounded-[50%] bg-black/35 blur-md" />
            <div className="absolute inset-x-4 bottom-1 h-5 rounded-[50%] bg-gradient-to-b from-[#8a5a32] to-[#4a2e17] shadow-[inset_0_2px_0_rgba(255,255,255,.2)]" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-cream/0">
        <svg viewBox="0 0 1440 60" className="block h-10 w-full text-cream" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V30Q360 0 720 25T1440 20V60Z" fill="currentColor" /></svg>
      </div>
    </section>
  )
}
