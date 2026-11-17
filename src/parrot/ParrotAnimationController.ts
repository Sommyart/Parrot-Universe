import gsap from 'gsap'

/**
 * ParrotAnimationController
 * -------------------------
 * A small, framework-agnostic state machine that drives the Scarlet Macaw using the
 * four supplied video clips (chroma-keyed to transparent WebM, with an MP4 + canvas
 * chroma-key fallback for browsers without VP9-alpha support such as Safari).
 *
 * States: arrival -> landing -> idle <-> curious -> takeoff -> flying -> returning -> landing -> idle
 *
 * Coordinates are document coordinates (page x/y), so the perched bird scrolls with the hero.
 * The "mover" point means: the bird's feet while perched, the bird's body while flying.
 */

const FACTS = [
  'Macaws can live for decades!',
  'My beak can crack hard nuts.',
  'I love fresh fruit and veggies.',
  'Parrots are super smart birds.',
  'Scarlet Macaws come from Central and South America.',
]

export type ClipName = 'hover' | 'curious' | 'takeoff' | 'landing'
export type ParrotState = 'loading' | 'arrival' | 'landing' | 'idle' | 'curious' | 'takeoff' | 'flying' | 'returning' | 'static'

interface ClipMeta {
  /** where the bird's anchor point sits inside the 16:9 frame (fractions) */
  ax: number
  ay: number
  scale: number
}

// Measured from the supplied footage (see README for notes).
const CLIP_META: Record<ClipName, ClipMeta> = {
  curious: { ax: 0.52, ay: 0.68, scale: 1 },
  landing: { ax: 0.5, ay: 0.68, scale: 1 },
  takeoff: { ax: 0.57, ay: 0.68, scale: 1 },
  hover: { ax: 0.5, ay: 0.5, scale: 0.72 }, // clip is stabilised: body locked at frame centre
}

// Key moments inside the clips (seconds)
const T = {
  landingJoin: 1.0, // bird is mid-approach, entering from the left
  landingDone: 6.4, // bird has settled on the perch
  takeoffStart: 3.0, // perched, about to lift wings
  takeoffLeave: 4.7, // bird has left the branch
}

// Offsets (as fractions of stage W/H) from the feet anchor to where the bird body is
const LANDING_JOIN_OFFSET = { x: -0.2, y: -0.28 }
const TAKEOFF_LEAVE_OFFSET = { x: -0.05, y: -0.33 }

const ALLOWED: Record<ParrotState, ParrotState[]> = {
  loading: ['arrival', 'idle', 'static'],
  arrival: ['landing', 'static'],
  landing: ['idle', 'static'],
  idle: ['curious', 'takeoff', 'flying', 'static'],
  curious: ['idle', 'takeoff', 'flying', 'static'],
  takeoff: ['flying', 'static'],
  flying: ['returning', 'static'],
  returning: ['landing', 'static'],
  static: [],
}

export interface ClipLayer {
  name: ClipName
  el: HTMLElement
  video: HTMLVideoElement
  /** called every tick while visible (used by the canvas chroma-key fallback) */
  render?: () => void
}

export interface ControllerOptions {
  mover: HTMLElement
  stage: HTMLElement
  layers: Record<ClipName, ClipLayer>
  getPerch: () => { x: number; y: number; visible: boolean } | null
  stageWidth: () => number
  isTouch: boolean
  reducedMotion: boolean
  onStateChange?: (s: ParrotState) => void
  bubble?: HTMLElement
}

export class ParrotAnimationController {
  state: ParrotState = 'loading'
  private o: ControllerOptions
  private W = 480
  private H = 270
  private active: ClipLayer | null = null
  private pos = { x: -400, y: 200 }
  private pointer = { x: -9999, y: -9999, clientX: -9999, clientY: -9999, inside: false, lastMove: 0 }
  private perch = { x: 0, y: 0, visible: true }
  private lastLandedAt = -Infinity
  private lastCuriousAt = -Infinity
  private nearSince = 0
  private turnVotes = 0
  private autoWaypoints: { x: number; y: number }[] = []
  private facing = 1 // 1 = facing left (native), -1 = mirrored (facing right)
  private tilt = 0
  private tl: gsap.core.Timeline | gsap.core.Tween | null = null
  private timers: number[] = []
  private disposers: (() => void)[] = []
  private time = 0
  private hidden = false

  constructor(o: ControllerOptions) {
    this.o = o
    this.measure()
    this.bind()
    gsap.ticker.add(this.tick)
    this.disposers.push(() => gsap.ticker.remove(this.tick))
  }

  // ---------------------------------------------------------------- setup
  private bind() {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      this.pointer.clientX = e.clientX
      this.pointer.clientY = e.clientY
      this.pointer.x = e.clientX + window.scrollX
      this.pointer.y = e.clientY + window.scrollY
      this.pointer.inside = true
      this.pointer.lastMove = performance.now()
    }
    const onLeave = () => { this.pointer.inside = false }
    const onScroll = () => {
      if (this.pointer.inside) {
        this.pointer.x = this.pointer.clientX + window.scrollX
        this.pointer.y = this.pointer.clientY + window.scrollY
      }
    }
    // Taps never block the page: the parrot layer has pointer-events: none,
    // so we hit-test the tap against the bird's position instead.
    const onDown = (e: PointerEvent) => {
      const px = e.clientX + window.scrollX
      const py = e.clientY + window.scrollY
      const b = this.bodyPoint()
      const hit = Math.hypot(px - b.x, py - b.y) < Math.max(70, this.H * 0.35)
      if (hit && (this.state === 'idle' || this.state === 'curious')) {
        if (e.pointerType === 'touch' || this.o.isTouch) this.takeoff(true)
        else { this.react(); this.say(FACTS[Math.floor(Math.random() * FACTS.length)], 3500) }
      }
    }
    const onVis = () => {
      this.hidden = document.hidden
      if (this.hidden) this.active?.video.pause()
      else this.active?.video.play().catch(() => {})
    }
    const onResize = () => this.measure()
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    this.disposers.push(() => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    })
  }

  private measure() {
    this.W = this.o.stageWidth()
    this.H = (this.W * 9) / 16
    this.o.stage.style.width = `${this.W}px`
    this.o.stage.style.height = `${this.H}px`
    for (const l of Object.values(this.o.layers)) {
      const m = CLIP_META[l.name]
      gsap.set(l.el, {
        width: this.W * m.scale,
        height: this.H * m.scale,
        x: -m.ax * this.W * m.scale,
        y: -m.ay * this.H * m.scale,
      })
    }
    const p = this.o.getPerch()
    if (p) this.perch = p
  }

  // ---------------------------------------------------------------- public
  start() {
    this.measure()
    if (this.o.reducedMotion) return this.toStatic(true)
    this.arrive()
  }

  destroy() {
    this.killTimeline()
    this.timers.forEach((t) => clearTimeout(t))
    this.disposers.forEach((d) => d())
    Object.values(this.o.layers).forEach((l) => l.video.pause())
  }

  /** Graceful fallback when a clip fails to load. */
  fail() {
    this.toStatic(false)
  }

  // ---------------------------------------------------------------- states
  private bubbleTween: gsap.core.Timeline | null = null
  /** Show a short speech bubble above Ruby. */
  say(text: string, ms = 2200) {
    const b = this.o.bubble
    if (!b || this.o.reducedMotion || this.state === 'static') return
    b.textContent = text
    this.bubbleTween?.kill()
    this.bubbleTween = gsap.timeline()
      .fromTo(b, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' })
      .to(b, { opacity: 0, scale: 0.8, duration: 0.3, delay: ms / 1000 })
  }

  private set(to: ParrotState): boolean {
    if (to === this.state) return true
    if (!ALLOWED[this.state].includes(to)) return false
    const lines: Partial<Record<ParrotState, string[]>> = {
      takeoff: ['Squawk!', 'Wheee!', 'Follow you!', 'Up we go!'],
      returning: ['Nap time...', 'Back to my perch!', 'Phew, tired wings!'],
    }
    const pool = lines[to]
    if (pool) this.say(pool[Math.floor(Math.random() * pool.length)])
    this.state = to
    this.o.mover.dataset.state = to
    this.o.onStateChange?.(to)
    return true
  }

  private arrive() {
    if (!this.set('arrival')) return
    const join = this.landingJoinPoint()
    this.facing = -1
    this.pos = { x: window.scrollX - this.W * 0.4, y: join.y - 140 }
    this.preseek('landing', T.landingJoin)
    this.show('hover', 0)
    this.applyTransform()
    this.killTimeline()
    this.tl = gsap.to(this.pos, {
      keyframes: [
        { x: (this.pos.x + join.x) / 2, y: join.y - 180, ease: 'sine.inOut', duration: 1.1 },
        { x: join.x, y: join.y, ease: 'sine.out', duration: 1.1 },
      ],
      onComplete: () => this.land(),
    })
  }

  private land() {
    if (!this.set('landing')) return
    this.facing = 1
    this.tilt = 0
    this.pos = { ...this.perch }
    this.show('landing', 0.22, T.landingJoin)
  }

  private greeted = false
  private idle() {
    if (!this.set('idle')) return
    if (!this.greeted) { this.greeted = true; this.say(this.o.isTouch ? "Hi, I'm Ruby! Tap me!" : "Hi, I'm Ruby! Move your mouse!", 3200) }
    this.lastLandedAt = performance.now()
    this.show('curious', 0.45, 0)
    this.o.layers.curious.video.loop = true
    this.o.layers.curious.video.playbackRate = 0.85
    this.preseek('takeoff', T.takeoffStart)
  }

  /** Curious reaction (cursor nearby or click on bird). */
  private react() {
    if (this.state !== 'idle' || performance.now() - this.lastCuriousAt < 2500) return
    if (!this.set('curious')) return
    this.lastCuriousAt = performance.now()
    const v = this.o.layers.curious.video
    v.playbackRate = 1.35
    this.later(1800, () => {
      if (this.state === 'curious') {
        v.playbackRate = 0.85
        this.state = 'idle' // quiet return without re-seeking the clip
        this.o.mover.dataset.state = 'idle'
        this.o.onStateChange?.('idle')
      }
    })
  }

  private takeoff(autonomous = false) {
    const now = performance.now()
    if (now - this.lastLandedAt < 2500) return // short rest on the perch after landing
    if (!this.perch.visible) {
      // perch scrolled away: fly in from the top edge instead of playing the takeoff clip
      if (!this.set('flying')) return
      this.autoWaypoints = autonomous ? this.makeWaypoints() : []
      this.pos = { x: window.scrollX + window.innerWidth * 0.5, y: window.scrollY - this.H * 0.3 }
      this.show('hover', 0.2, 0)
      this.o.layers.hover.video.loop = true
      return
    }
    if (!this.set('takeoff')) return
    this.autoWaypoints = autonomous ? this.makeWaypoints() : []
    this.show('takeoff', 0.25, T.takeoffStart)
    this.o.layers.takeoff.video.playbackRate = 1.15
    this.later(3500, () => this.state === 'takeoff' && this.fly()) // safety net if the clip stalls
  }

  private fly() {
    if (!this.set('flying')) return
    this.pos = { x: this.perch.x + TAKEOFF_LEAVE_OFFSET.x * this.W, y: this.perch.y + TAKEOFF_LEAVE_OFFSET.y * this.H }
    this.preseek('landing', T.landingJoin)
    this.show('hover', 0.18, 0)
    this.o.layers.hover.video.loop = true
  }

  private returnHome() {
    if (!this.set('returning')) return
    const join = this.landingJoinPoint()
    const frames: gsap.TweenVars[] = []
    // The landing clip shows the bird arriving from the left, so approach from the left.
    if (this.pos.x > join.x - 60) {
      const via = { x: join.x - Math.max(220, this.W * 0.45), y: Math.min(this.pos.y, join.y) - 120 }
      frames.push({ x: via.x, y: via.y, duration: this.dur(this.pos, via), ease: 'sine.inOut' })
      frames.push({ x: join.x, y: join.y, duration: this.dur(via, join), ease: 'sine.out' })
    } else {
      frames.push({ x: join.x, y: join.y, duration: this.dur(this.pos, join), ease: 'sine.inOut' })
    }
    this.killTimeline()
    let lastX = this.pos.x
    this.tl = gsap.to(this.pos, {
      keyframes: frames,
      onUpdate: () => {
        const dx = this.pos.x - lastX
        lastX = this.pos.x
        if (Math.abs(dx) > 0.4) this.facing = dx > 0 ? -1 : 1
        this.tilt = gsap.utils.clamp(-14, 14, dx * 1.2)
      },
      onComplete: () => this.land(),
    })
  }

  private toStatic(showBird: boolean) {
    this.killTimeline()
    this.state = 'static'
    this.o.mover.dataset.state = 'static'
    this.o.onStateChange?.('static')
    Object.values(this.o.layers).forEach((l) => { l.video.pause(); gsap.set(l.el, { opacity: 0 }) })
    this.active = null
    this.pos = { ...this.perch }
    this.facing = 1
    this.tilt = 0
    if (showBird) {
      const c = this.o.layers.curious
      c.video.currentTime = 0
      gsap.set(c.el, { opacity: 1 })
      this.active = c
    }
    this.applyTransform()
  }

  // ---------------------------------------------------------------- loop
  private tick = (time: number, deltaMs: number) => {
    if (this.hidden) return
    const dt = Math.min(deltaMs, 50) / 1000
    this.time = time
    const p = this.o.getPerch()
    if (p) this.perch = p
    this.active?.render?.()

    switch (this.state) {
      case 'landing': {
        this.pos = { ...this.perch }
        const v = this.o.layers.landing.video
        if (v.currentTime >= T.landingDone || v.ended) this.idle()
        break
      }
      case 'idle':
      case 'curious':
        this.pos = { ...this.perch }
        this.perchedAwareness(dt)
        break
      case 'takeoff': {
        this.pos = { ...this.perch }
        if (this.o.layers.takeoff.video.currentTime >= T.takeoffLeave) this.fly()
        break
      }
      case 'flying':
        this.flyStep(dt)
        break
      case 'static':
        this.pos = { ...this.perch }
        break
    }
    this.applyTransform()
  }

  /** Cursor awareness while perched: lean/tilt toward the cursor and turn to face it. */
  private perchedAwareness(dt: number) {
    const body = this.bodyPoint()
    const now = performance.now()
    let targetTilt = Math.sin(this.time * 1.3) * 1.2 // gentle breathing sway
    if (!this.o.isTouch && this.pointer.inside) {
      const dx = this.pointer.x - body.x
      const dy = this.pointer.y - body.y
      const dist = Math.hypot(dx, dy)
      const wantFacing = dx > 40 ? -1 : dx < -40 ? 1 : this.facing
      if (wantFacing !== this.facing && dist < window.innerWidth * 0.9) this.turn(wantFacing)
      targetTilt += gsap.utils.clamp(-7, 7, (dy / 300) * 7 * -Math.sign(dx || 1))
      const curiousR = Math.max(200, this.H * 0.9)
      const takeoffR = Math.max(85, this.H * 0.33)
      if (dist < curiousR) this.react()
      if (dist < takeoffR) {
        if (!this.nearSince) this.nearSince = now
        if (now - this.nearSince > 220) this.takeoff(false)
      } else this.nearSince = 0
      // Follow mode: as soon as the visitor moves the cursor, Ruby takes off to join it.
      if (now - this.pointer.lastMove < 250 && now - this.lastLandedAt > 2500) this.takeoff(false)
    }
    this.tilt += (targetTilt - this.tilt) * (1 - Math.exp(-dt * 4))
  }

  private turnTween: gsap.core.Tween | null = null
  private flipVisual = 1
  private turn(to: number) {
    this.facing = to
    this.turnTween?.kill()
    this.turnTween = gsap.to(this, { flipVisual: to, duration: 0.45, ease: 'power2.inOut' })
  }

  private flyStep(dt: number) {
    const now = performance.now()
    let target: { x: number; y: number }
    if (this.autoWaypoints.length) {
      target = this.autoWaypoints[0]
      if (Math.hypot(target.x - this.pos.x, target.y - this.pos.y) < 40) this.autoWaypoints.shift()
      if (!this.autoWaypoints.length) return this.returnHome()
    } else {
      const idleFor = now - this.pointer.lastMove
      // Cursor inactive (or outside the window) for 10 seconds: fly back to the perch.
      if (idleFor > 10000) return this.returnHome()
      // Hover beside the cursor rather than on top of it, so content stays readable.
      const side = this.pointer.clientX > window.innerWidth / 2 ? -1 : 1
      // keep cursor position in page coordinates in sync while the page scrolls
      const cx = this.pointer.clientX + window.scrollX
      const cy = this.pointer.clientY + window.scrollY
      if (idleFor > 3000 || !this.pointer.inside) {
        // cursor has been resting a while: drift in a small, gentle loop beside it
        const a = (idleFor - 3000) / 1000 * 0.8
        target = { x: cx + side * 80 + Math.cos(a) * 40, y: cy - 20 + Math.sin(a) * 25 }
      } else {
        // fixed spot just beside the cursor, level with it
        target = { x: cx + side * 80, y: cy - 20 }
      }
    }
    // clamp into the visible viewport
    const m = this.H * 0.35
    target.x = gsap.utils.clamp(window.scrollX + m, window.scrollX + window.innerWidth - m, target.x)
    target.y = gsap.utils.clamp(window.scrollY + m + 70, window.scrollY + window.innerHeight - m, target.y)

    // Direct follow: close the gap quickly with no overshoot, so Ruby stays aligned with the cursor.
    const follow = this.autoWaypoints.length ? 2.5 : 10
    const prevX = this.pos.x
    const t = 1 - Math.exp(-dt * follow)
    this.pos.x += (target.x - this.pos.x) * t
    this.pos.y += (target.y - this.pos.y) * t
    const vx = (this.pos.x - prevX) / Math.max(dt, 0.001)

    // Turn around only on a clear, sustained change of direction (no flicker).
    const want = vx > 0 ? -1 : 1
    if (Math.abs(vx) > 160 && want !== this.facing) {
      this.turnVotes += dt
      if (this.turnVotes > 0.12) { this.turn(want); this.turnVotes = 0 }
    } else this.turnVotes = 0
    // Small bank into horizontal movement only.
    const targetTilt = gsap.utils.clamp(-10, 10, -vx * 0.012 * this.facing)
    this.tilt += (targetTilt - this.tilt) * (1 - Math.exp(-dt * 8))
  }

  // ---------------------------------------------------------------- helpers
  private applyTransform() {
    if (this.state === 'arrival' || this.state === 'returning' || this.state === 'landing') this.flipVisual = this.facing
    if (this.o.bubble) {
      const b = this.bodyPoint()
      gsap.set(this.o.bubble, { x: b.x, y: b.y - this.H * 0.3 })
    }
    gsap.set(this.o.mover, { x: this.pos.x, y: this.pos.y, rotation: this.tilt, scaleX: this.flipVisual === 0 ? 0.001 : this.flipVisual })
  }

  private show(name: ClipName, fade: number, from?: number) {
    const next = this.o.layers[name]
    const prev = this.active
    if (from !== undefined && Math.abs(next.video.currentTime - from) > 0.05) next.video.currentTime = from
    next.video.playbackRate = 1
    next.video.play().catch(() => {})
    gsap.to(next.el, { opacity: 1, duration: fade, ease: 'none', overwrite: true })
    if (prev && prev !== next) {
      gsap.to(prev.el, { opacity: 0, duration: fade, ease: 'none', overwrite: true, onComplete: () => { if (this.active !== prev) prev.video.pause() } })
    }
    this.active = next
  }

  private preseek(name: ClipName, t: number) {
    const v = this.o.layers[name].video
    if (this.active?.video !== v) { v.pause(); try { v.currentTime = t } catch { /* not ready yet */ } }
  }

  private landingJoinPoint() {
    return { x: this.perch.x + LANDING_JOIN_OFFSET.x * this.W, y: this.perch.y + LANDING_JOIN_OFFSET.y * this.H }
  }

  /** Approximate centre of the perched bird's body */
  private bodyPoint() {
    if (this.state === 'flying' || this.state === 'returning' || this.state === 'arrival') return this.pos
    return { x: this.perch.x, y: this.perch.y - this.H * 0.22 }
  }

  private makeWaypoints() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const sx = window.scrollX
    const sy = window.scrollY
    return Array.from({ length: 3 }, (_, i) => ({
      x: sx + vw * (i % 2 ? 0.25 : 0.7) + (Math.random() - 0.5) * vw * 0.2,
      y: sy + vh * (0.25 + Math.random() * 0.4),
    }))
  }

  private dur(a: { x: number; y: number }, b: { x: number; y: number }) {
    return 0.5 + Math.hypot(b.x - a.x, b.y - a.y) / 650
  }

  private later(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms)
    this.timers.push(id)
  }

  private killTimeline() {
    this.tl?.kill()
    this.tl = null
  }

  /** React to things happening on the site (e.g. add to cart). */
  cheer(text: string) {
    this.say(text)
    if (this.state === 'idle') { this.lastCuriousAt = 0; this.react() }
  }

  /** Mobile: gentle autonomous behaviour (a small curious moment every so often). */
  nudge() {
    if (this.state === 'idle') { this.lastCuriousAt = 0; this.react() }
  }
}
