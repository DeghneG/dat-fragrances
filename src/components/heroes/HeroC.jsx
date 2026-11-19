import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AventusScene from '../AventusScene'
import Motes from '../Motes'
import useHeroIn from './useHeroIn'

// C: Anatomy. The bottle sits inside slow gold rings; its notes are called out beside it.
export default function HeroC({ product }) {
  const root = useRef(null)
  useHeroIn(root)
  const tiers = [
    ['Top', product.notes.top],
    ['Heart', product.notes.heart],
    ['Base', product.notes.base],
  ]
  return (
    <section className="hc" ref={root}>
      <Motes count={36} />
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={5}>
            <h1 className="hc__title" data-in>Read the scent <em>like a map.</em></h1>
            <p className="hc__sub" data-in>Every bottle is built in three layers. Start at the top, end at the base. Turn the bottle and see.</p>
            <div className="d-flex flex-wrap gap-3" data-in>
              <Button as={Link} to={`/shop/${product.slug}`} className="btn-brass">Discover {product.name}</Button>
              <Button as={Link} to="/shop" className="btn-ghost">Explore the collection</Button>
            </div>
          </Col>
          <Col lg={7}>
            <div className="hc__stage" data-fade>
              <svg className="hc__rings" viewBox="0 0 600 600" aria-hidden="true">
                <g className="hc__spin">
                  <circle cx="300" cy="300" r="286" fill="none" stroke="rgba(212,185,126,0.22)" strokeWidth="1" />
                  <circle cx="300" cy="300" r="262" fill="none" stroke="rgba(212,185,126,0.5)" strokeWidth="6" strokeDasharray="1 9" />
                </g>
                <g className="hc__spin hc__spin--rev">
                  <circle cx="300" cy="300" r="226" fill="none" stroke="rgba(212,185,126,0.3)" strokeWidth="1" strokeDasharray="2 7" />
                  <circle cx="300" cy="300" r="196" fill="none" stroke="rgba(212,185,126,0.16)" strokeWidth="1" />
                </g>
              </svg>
              <div className="hc__bottle"><AventusScene product={product} /></div>
              <ul className="hc__callouts">
                {tiers.map(([label, notes]) => (
                  <li key={label}>
                    <i aria-hidden="true" />
                    <div>
                      <span>{label}</span>
                      <p>{notes.slice(0, 3).join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
