import gsap from 'gsap'
import { useEffect } from 'react'

/** Fades `.reveal` elements in as they scroll into view. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not([data-revealed])'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => { el.dataset.revealed = '1'; gsap.set(el, { opacity: 1, y: 0 }) })
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        visible.forEach((e, i) => {
          const el = e.target as HTMLElement
          el.dataset.revealed = '1'
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.07, ease: 'power3.out' })
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
