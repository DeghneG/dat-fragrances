import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import AventusScene from '../AventusScene'
import Motes from '../Motes'

// A: the current hero. Split layout, headline left, the bottle right.
export default function HeroA({ product }) {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero__line', { yPercent: 110, duration: 1.4, stagger: 0.12 })
          .from('.hero__sub, .hero__cta', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.9')
          .from('.hero__stage', { opacity: 0, filter: 'blur(14px)', duration: 1.8 }, 0.2)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="hero" ref={root}>
      <div className="hero__aura" aria-hidden="true" />
      <Motes />
      <div className="hero__scroll" aria-hidden="true"><span>Scroll</span><i /></div>
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={7}>
            <h1 className="hero__title">
              <span className="hero__mask"><span className="hero__line">The scent</span></span>
              <span className="hero__mask"><span className="hero__line"><em>is the signature.</em></span></span>
            </h1>
            <p className="hero__sub">
              Designer, Middle Eastern and niche fragrances, read the way enthusiasts read them: top, heart and base.
            </p>
            <div className="hero__cta d-flex flex-wrap gap-3">
              <Button as={Link} to="/shop" className="btn-brass">Explore the collection</Button>
              <Button as={Link} to={`/shop/${product.slug}`} className="btn-ghost">Discover {product.name}</Button>
            </div>
          </Col>
          <Col lg={5} className="text-center">
            <div className="hero__stage">
              <AventusScene product={product} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
