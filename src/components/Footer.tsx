import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-20 text-cream/70">
      <div className="container-x grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">Discover the Colourful World of Parrots. A fictional demonstration store showcasing an interactive web experience.</p>
          <div className="mt-6 flex gap-2">
            {['Instagram', 'Facebook', 'YouTube', 'TikTok'].map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-gold hover:text-gold" aria-label={`${s} (placeholder)`}>{s}</a>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-cream/40">Social links are placeholders.</p>
        </div>
        <div>
          <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-cream">Shop</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/shop" className="hover:text-gold">Shop Parrots</Link></li>
            <li><Link to="/accessories" className="hover:text-gold">Accessories</Link></li>
            <li><Link to="/cart" className="hover:text-gold">Cart</Link></li>
            <li><Link to="/#newsletter" className="hover:text-gold">Newsletter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-cream">Company</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-cream">Contact <span className="ml-1 rounded bg-gold/20 px-1.5 py-0.5 text-[10px] text-gold">Fictional</span></h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-gold" />123 Rainbow Feather Avenue, Parrot Bay, California 90210, USA</li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-gold" />hello@parrotuniverse.example</li>
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-gold" />+1 (555) 010-2026</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-cream/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Parrot Universe (demonstration project). Not a real business. No animals are sold.</p>
          <p>Photography is AI-generated for this demo. Parrot animation from supplied footage.</p>
        </div>
      </div>
    </footer>
  )
}
