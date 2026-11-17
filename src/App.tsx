import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import FeatherBurst from './components/FeatherBurst'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useStore } from './context/StoreContext'
import Accessories from './pages/Accessories'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import { About, Article, Contact, Legal } from './pages/InfoPages'
import NotFound from './pages/NotFound'
import ProductDetails from './pages/ProductDetails'
import Shop from './pages/Shop'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function Toast() {
  const { toast } = useStore()
  return (
    <div aria-live="polite" className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 transition-all duration-500 ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}>
      {toast && <div className="flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream shadow-2xl"><CheckCircle2 className="h-4 w-4 text-gold" />{toast}</div>}
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/parrots/:id" element={<ProductDetails />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/learn/:slug" element={<Article />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      <FeatherBurst />
    </>
  )
}
