import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Fade-and-rise for any [data-reveal] element inside the scope. Skipped for reduced motion.
export default function useReveal(scope, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray('[data-reveal]', scope.current)
        gsap.set(items, { opacity: 0, y: 28 })
        const draws = gsap.utils.toArray('[data-draw]', scope.current)
        gsap.set(draws, { scaleX: 0, transformOrigin: '50% 50%' })
        ScrollTrigger.batch(draws, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12 }),
        })
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        })
      })
      return () => mm.revert()
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
