import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Billboard hero. Slides sit side by side and the track wipes across, then loops.
// To add a slide: push another entry here (photo slides need a file in /public/images).
const SLIDES = [
  {
    key: 'lattafa',
    src: '/images/hero-lattafa-2400.webp',
    src1x: '/images/hero-lattafa-1200.webp',
    alt: 'Lattafa fragrances on stone podiums: Khamrah, Khamrah Qahwa, Yara, Club de Nuit Intense Man, Eclaire, Badee Al Oud and Asad.',
    eyebrow: 'Middle Eastern',
    title: (
      <>
        Warm, rich and <em>made to be noticed.</em>
      </>
    ),
    cta: { label: 'Shop Middle Eastern', to: '/shop?category=Middle%20Eastern' },
  },
  {
    key: 'valentino',
    src: '/images/hero-valentino-2400.webp',
    src1x: '/images/hero-valentino-1200.webp',
    alt: 'Valentino Born in Roma fragrances in studded glass bottles on stone steps among lavender, with Rome at dusk behind.',
    eyebrow: 'Designer',
    title: (
      <>
        Bold studs, <em>soft in the air.</em>
      </>
    ),
    cta: { label: 'Shop Designer', to: '/shop?category=Designer' },
  },
  {
    key: 'initio',
    src: '/images/hero-initio-2400.webp',
    src1x: '/images/hero-initio-1200.webp',
    alt: 'Initio Parfums Privés bottles on sandstone: the black and gold Oud for Greatness beside three purple bottles with gold diamond plates.',
    eyebrow: 'Niche',
    title: (
      <>
        Small houses, <em>singular ideas.</em>
      </>
    ),
    cta: { label: 'Shop Niche', to: '/shop?category=Niche' },
  },
]

const INTERVAL = 5000
const SWIPE = 50

export default function HeroCarousel() {
  const n = SLIDES.length
  const slides = [...SLIDES, SLIDES[0]] // trailing clone of slide one gives a seamless loop
  const [idx, setIdx] = useState(0)
  const [anim, setAnim] = useState(true)
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0)
  const reduce = useRef(false)
  const drag = useRef({ x: 0, down: false, moved: false })
  const real = idx % n

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const next = useCallback(() => {
    setAnim(true)
    setIdx((i) => Math.min(i + 1, n))
  }, [n])

  const prev = useCallback(() => {
    if (idx === 0) {
      // jump to the clone with no animation, then slide back one
      setAnim(false)
      setIdx(n)
      requestAnimationFrame(() => requestAnimationFrame(() => { setAnim(true); setIdx(n - 1) }))
    } else {
      setAnim(true)
      setIdx(idx - 1)
    }
  }, [idx, n])

  const goTo = (i) => { setAnim(true); setIdx(i) }

  // auto-advance; paused on hover/focus/drag, when the tab is hidden, and for reduced motion
  useEffect(() => {
    if (paused || reduce.current) return undefined
    const t = setTimeout(() => { if (!document.hidden) next() }, INTERVAL)
    return () => clearTimeout(t)
  }, [idx, paused, tick, next])

  const onEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (idx === n) { setAnim(false); setIdx(0) }
  }

  const onDown = (e) => { drag.current = { x: e.clientX, down: true, moved: false } }
  const onUp = (e) => {
    const d = drag.current
    if (!d.down) return
    d.down = false
    const dx = e.clientX - d.x
    if (Math.abs(dx) > SWIPE) { d.moved = true; if (dx < 0) next(); else prev(); setTick((t) => t + 1) }
  }
  const onClickCapture = (e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false } }
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }
  const resume = () => { setPaused(false); setTick((t) => t + 1) }

  return (
    <section
      className="hr"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resume}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={resume}
      onKeyDown={onKey}
    >
      <div
        className="hr__view"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { drag.current.down = false }}
        onClickCapture={onClickCapture}
      >
        <div
          className={`hr__track ${anim ? '' : 'is-instant'}`}
          style={{ transform: `translateX(${-idx * 100}%)` }}
          onTransitionEnd={onEnd}
        >
          {slides.map((s, i) => {
            const clone = i === n
            const active = i === idx
            return (
              <div
                key={`${s.key}-${clone ? 'clone' : 'main'}`}
                className={`hr__slide ${active ? 'is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(i % n) + 1} of ${n}`}
                aria-hidden={clone || !active ? true : undefined}
                inert={!active}
              >
                <img
                  className="hr__img"
                  src={s.src}
                  srcSet={`${s.src1x} 1200w, ${s.src} 2400w`}
                  sizes="100vw"
                  alt={clone ? '' : s.alt}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : undefined}
                  draggable="false"
                />
                <div className="hr__scrim" aria-hidden="true" />
                <div className="hr__copy">
                  <p className="hr__eyebrow">{s.eyebrow}</p>
                  {/* only the first real slide owns the page h1 */}
                  {i === 0 ? <h1 className="hr__title">{s.title}</h1> : <h2 className="hr__title">{s.title}</h2>}
                  <div className="hr__cta">
                    <Button as={Link} to={s.cta.to} className="btn-brass">{s.cta.label}</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hr__dots" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === real}
              aria-label={`Slide ${i + 1}`}
              className={`hr__dot ${i === real ? 'is-on' : ''}`}
              onClick={() => { goTo(i); setTick((t) => t + 1) }}
            >
              <i key={`${real}-${tick}-${paused}`} style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
