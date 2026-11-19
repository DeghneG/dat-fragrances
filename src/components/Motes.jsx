import { useEffect, useRef } from 'react'

// Slow-drifting gold dust. Pauses off-screen; a static sprinkle for reduced motion.
export default function Motes({ count = 60 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const motes = Array.from({ length: reduce ? 24 : count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      vy: 0.012 + Math.random() * 0.03,
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 0.9,
    }))

    const size = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        const x = (m.x + Math.sin(t * 0.0002 * m.sp + m.ph) * 0.02) * w
        const y = m.y * h
        const a = 0.15 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.0012 * m.sp + m.ph))
        ctx.beginPath()
        ctx.fillStyle = `rgba(236, 213, 160, ${a})`
        ctx.shadowColor = 'rgba(212, 185, 126, 0.7)'
        ctx.shadowBlur = m.r * 6
        ctx.arc(x, y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const loop = (t) => {
      const dt = Math.min(50, t - last || 16)
      last = t
      for (const m of motes) {
        m.y -= m.vy * (dt / 1000)
        if (m.y < -0.02) {
          m.y = 1.02
          m.x = Math.random()
        }
      }
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!running && !reduce) {
        running = true
        last = 0
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    size()
    draw(0)
    const ro = new ResizeObserver(() => {
      size()
      draw(0)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(canvas)
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
  }, [count])

  return <canvas ref={ref} className="motes" aria-hidden="true" />
}
