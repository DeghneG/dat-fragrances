import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AventusScene from '../AventusScene'
import useHeroIn from './useHeroIn'
import { peso } from '../../data/products'

// D: Arch. A gold-lit arch frames the dark bottle, like a window in a boutique.
export default function HeroD({ product }) {
  const root = useRef(null)
  useHeroIn(root)
  return (
    <section className="hd" ref={root}>
      <Container>
        <Row className="align-items-end gy-5">
          <Col lg={4} className="order-2 order-lg-1">
            <h1 className="hd__title" data-in>The scent <em>is the signature.</em></h1>
            <p className="hd__sub" data-in>Designer, Middle Eastern and niche fragrances, read the way enthusiasts read them.</p>
          </Col>
          <Col lg={4} className="order-1 order-lg-2">
            <div className="hd__arch" data-fade>
              <span className="hd__sun" aria-hidden="true" />
              <div className="hd__bottle"><AventusScene product={product} /></div>
            </div>
          </Col>
          <Col lg={4} className="order-3 hd__right">
            <p className="hd__house" data-in>{product.house}</p>
            <p className="hd__name" data-in>{product.name}</p>
            <p className="hd__price" data-in><span>from</span> {peso(product.price)}</p>
            <div className="d-flex flex-wrap gap-3" data-in>
              <Button as={Link} to={`/shop/${product.slug}`} className="btn-brass">Discover {product.name}</Button>
              <Button as={Link} to="/shop" className="btn-ghost">Shop all</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
