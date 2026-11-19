import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Staggered rise for every [data-in] element in a hero. Skipped for reduced motion.
export default function useHeroIn(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(gsap.utils.toArray('[data-in]', scope.current), { opacity: 0, y: 30, duration: 1.3, stagger: 0.12, ease: 'expo.out' })
        gsap.from(gsap.utils.toArray('[data-fade]', scope.current), { opacity: 0, filter: 'blur(14px)', duration: 2, ease: 'expo.out', delay: 0.15 })
      })
      return () => mm.revert()
    },
    { scope },
  )
}
