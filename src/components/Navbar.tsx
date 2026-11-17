import { Bird, Menu, ShoppingBag, X } from 'lucide-react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop Parrots' },
  { to: '/accessories', label: 'Accessories' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { count, parrotEnabled, setParrotEnabled } = useStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const overHero = pathname === '/' && !scrolled
  const cartRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(count)
  useEffect(() => {
    if (count > prevCount.current && cartRef.current) {
      gsap.fromTo(cartRef.current, { scale: 1 }, { keyframes: [{ scale: 1.35, rotate: -12, duration: 0.15 }, { scale: 0.9, rotate: 8, duration: 0.15 }, { scale: 1, rotate: 0, duration: 0.3, ease: 'elastic.out(1,0.4)' }] })
    }
    prevCount.current = count
  }, [count])
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [pathname])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${overHero ? 'bg-transparent py-5' : 'bg-cream/90 py-3 shadow-[0_10px_30px_-20px_rgba(18,61,43,.5)] backdrop-blur-md'}`}>
      <div ref={barRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-[#d7263d] via-gold to-[#2f7fc1]" style={{ transform: 'scaleX(0)' }} />
      <nav className="container-x flex items-center justify-between gap-4" aria-label="Main">
        <Link to="/" aria-label="Parrot Universe home"><Logo light={overHero} /></Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${overHero ? 'text-cream/85 hover:text-gold' : 'text-charcoal/75 hover:text-tropic'} ${isActive ? (overHero ? '!text-gold' : '!text-tropic') : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setParrotEnabled(!parrotEnabled)}
            aria-pressed={parrotEnabled}
            title={parrotEnabled ? 'Hide the animated parrot' : 'Show the animated parrot'}
            className={`hidden rounded-full p-2.5 transition sm:inline-flex ${overHero ? 'text-cream hover:bg-white/10' : 'text-forest hover:bg-forest/5'} ${parrotEnabled ? '' : 'opacity-50'}`}
          >
            <Bird className="h-5 w-5" />
            <span className="sr-only">Toggle animated parrot</span>
          </button>
          <Link ref={cartRef} to="/cart" className={`relative rounded-full p-2.5 transition ${overHero ? 'text-cream hover:bg-white/10' : 'text-forest hover:bg-forest/5'}`} aria-label={`Cart, ${count} items`}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-forest">{count}</span>}
          </Link>
          <Link to="/shop" className="btn-gold hidden !py-2.5 text-sm md:inline-flex">Explore Parrots</Link>
          <button className={`rounded-full p-2.5 lg:hidden ${overHero ? 'text-cream' : 'text-forest'}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      <div className={`overflow-hidden transition-[max-height] duration-500 lg:hidden ${open ? 'max-h-[480px]' : 'max-h-0'}`}>
        <div className="container-x mt-3 grid gap-1 rounded-3xl bg-forest p-4 text-cream shadow-xl">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => `rounded-2xl px-4 py-3 font-semibold ${isActive ? 'bg-white/10 text-gold' : 'hover:bg-white/5'}`}>{l.label}</NavLink>
          ))}
          <button onClick={() => setParrotEnabled(!parrotEnabled)} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left font-semibold hover:bg-white/5">
            <Bird className="h-5 w-5" /> Animated parrot: {parrotEnabled ? 'On' : 'Off'}
          </button>
          <Link to="/shop" className="btn-gold mt-2">Explore Parrots</Link>
        </div>
      </div>
    </header>
  )
}
