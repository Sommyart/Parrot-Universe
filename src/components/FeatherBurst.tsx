import gsap from 'gsap'
import { useEffect } from 'react'

const COLORS = ['#d7263d', '#F2BD45', '#2f7fc1', '#238B57']

/** Little burst of macaw-coloured feathers wherever the visitor clicks or taps. */
export default function FeatherBurst() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:70;overflow:hidden'
    document.body.appendChild(layer)
    const onDown = (e: PointerEvent) => {
      for (let i = 0; i < 7; i++) {
        const f = document.createElement('span')
        const c = COLORS[i % COLORS.length]
        f.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:7px;height:16px;border-radius:50% 50% 50% 50% / 70% 70% 30% 30%;background:linear-gradient(${c},${c}aa);`
        layer.appendChild(f)
        const a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6
        const d = 40 + Math.random() * 45
        gsap.fromTo(f, { x: -3, y: -8, rotate: (a * 180) / Math.PI + 90, opacity: 1, scale: 0.6 }, {
          x: Math.cos(a) * d, y: Math.sin(a) * d + 30, rotate: '+=' + (Math.random() * 200 - 100), opacity: 0, scale: 1,
          duration: 0.9 + Math.random() * 0.4, ease: 'power2.out', onComplete: () => f.remove(),
        })
      }
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => { window.removeEventListener('pointerdown', onDown); layer.remove() }
  }, [])
  return null
}
