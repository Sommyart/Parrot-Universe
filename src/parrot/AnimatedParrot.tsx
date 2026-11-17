import { useEffect, useRef, useState } from 'react'
import { ParrotAnimationController, type ClipLayer, type ClipName, type ParrotState } from './ParrotAnimationController'

const CLIPS: ClipName[] = ['hover', 'landing', 'curious', 'takeoff']

/** VP9-with-alpha WebM works in Chromium and Firefox. WebKit (Safari, all iOS browsers) ignores the alpha channel. */
function supportsAlphaWebm() {
  const ua = navigator.userAgent
  const webkitOnly = /iPhone|iPad|iPod/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|Edg|Firefox|Android/.test(ua))
  if (webkitOnly) return false
  return document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== ''
}

/** Browser-side chroma key, only used when transparent WebM is not supported. */
function makeChromaRenderer(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  canvas.width = 480
  canvas.height = 270
  let lastTime = -1
  return () => {
    if (video.readyState < 2 || video.currentTime === lastTime) return
    lastTime = video.currentTime
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = img.data
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2]
      const m = Math.max(r, b)
      const diff = g - m
      if (diff > 60) d[i + 3] = 0
      else if (diff > 20) {
        d[i + 3] = Math.round(255 * (1 - (diff - 20) / 40))
        d[i + 1] = m // despill
      } else if (diff > 0) d[i + 1] = m
    }
    ctx.putImageData(img, 0, 0)
  }
}

export default function AnimatedParrot({ enabled }: { enabled: boolean }) {
  const moverRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<Partial<Record<ClipName, HTMLDivElement | null>>>({})
  const videoRefs = useRef<Partial<Record<ClipName, HTMLVideoElement | null>>>({})
  const canvasRefs = useRef<Partial<Record<ClipName, HTMLCanvasElement | null>>>({})
  const [useAlpha] = useState(() => supportsAlphaWebm())
  const [state, setState] = useState<ParrotState>('loading')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const mover = moverRef.current!
    const stage = stageRef.current!
    const layers = {} as Record<ClipName, ClipLayer>
    for (const name of CLIPS) {
      const video = videoRefs.current[name]!
      const canvas = canvasRefs.current[name]
      layers[name] = {
        name,
        el: layerRefs.current[name]!,
        video,
        render: !useAlpha && canvas ? makeChromaRenderer(video, canvas) : undefined,
      }
    }

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let perchEl: HTMLElement | null = null
    const getPerch = () => {
      if (!perchEl || !perchEl.isConnected) perchEl = document.getElementById('parrot-perch')
      if (!perchEl) return null
      const r = perchEl.getBoundingClientRect()
      const H = (stageWidth() * 9) / 16
      return {
        x: r.left + r.width / 2 + window.scrollX,
        // the perch in the footage runs from the feet to the bottom of the frame (~32% of its height)
        y: r.bottom + window.scrollY - H * 0.32,
        visible: r.bottom > 0 && r.top < window.innerHeight,
      }
    }
    const stageWidth = () => {
      const vw = window.innerWidth
      if (vw < 640) return Math.min(520, vw * 1.05)
      if (vw < 1024) return 520
      return Math.min(940, Math.max(600, vw * 0.56))
    }

    const ctrl = new ParrotAnimationController({ mover, stage, layers, getPerch, stageWidth, isTouch, reducedMotion, onStateChange: setState })
    ;(window as unknown as { __parrot?: ParrotAnimationController }).__parrot = ctrl

    // Preload, then start once the arrival clips can play. Fallback to a still if anything fails.
    let started = false
    const begin = () => { if (!started) { started = true; ctrl.start() } }
    const onError = () => { setFailed(true); ctrl.fail() }
    const need = [layers.hover.video, layers.landing.video]
    let ready = 0
    const onReady = () => { if (++ready >= need.length) begin() }
    need.forEach((v) => (v.readyState >= 3 ? onReady() : v.addEventListener('canplaythrough', onReady, { once: true })))
    CLIPS.forEach((n) => layers[n].video.addEventListener('error', onError))
    const giveUp = window.setTimeout(() => { if (!started) begin() }, 7000)

    let nudgeTimer = 0
    if (isTouch && !reducedMotion) nudgeTimer = window.setInterval(() => ctrl.nudge(), 14000)

    return () => {
      clearTimeout(giveUp)
      clearInterval(nudgeTimer)
      need.forEach((v) => v.removeEventListener('canplaythrough', onReady))
      CLIPS.forEach((n) => layers[n].video.removeEventListener('error', onError))
      ctrl.destroy()
      delete (window as unknown as { __parrot?: unknown }).__parrot
    }
  }, [enabled, useAlpha])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-40 h-0 w-0 select-none" data-testid="parrot-layer">
      <div ref={moverRef} className="absolute left-0 top-0 will-change-transform" data-state={state}>
        <div ref={stageRef} className="relative">
          {CLIPS.map((name) => (
            <div key={name} ref={(el) => { layerRefs.current[name] = el }} className="absolute left-0 top-0 opacity-0">
              <video
                ref={(el) => { videoRefs.current[name] = el }}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                className={useAlpha ? 'h-full w-full' : 'hidden'}
                style={{ filter: 'drop-shadow(0 18px 18px rgba(18,61,43,.25))' }}
              >
                {useAlpha && <source src={`/parrot/${name}.webm`} type='video/webm; codecs="vp9"' />}
                <source src={`/parrot/${name}.mp4`} type="video/mp4" />
              </video>
              {!useAlpha && <canvas ref={(el) => { canvasRefs.current[name] = el }} className="h-full w-full" style={{ filter: 'drop-shadow(0 18px 18px rgba(18,61,43,.25))' }} />}
            </div>
          ))}
          {failed && (
            <img src="/img/macaw-perched.png" alt="" className="absolute" style={{ width: '100%', left: '-52%', top: '-68%' }} />
          )}
        </div>
      </div>
    </div>
  )
}
