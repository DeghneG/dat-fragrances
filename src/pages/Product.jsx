import { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'
import QtyStepper from '../components/QtyStepper'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import BackLink from '../components/BackLink'
import Divider from '../components/Divider'
import useReveal from '../hooks/useReveal'
import { bySlug, peso, products } from '../data/products'

const TIERS = [
  ['top', 'Top', 'First impression'],
  ['heart', 'Heart', 'The character'],
  ['base', 'Base', 'What stays'],
]

export default function Product() {
  const { slug } = useParams()
  const location = useLocation()
  const product = bySlug(slug)
  const root = useRef(null)
  const [sizeIdx, setSizeIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCart()
  const addedTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(addedTimer.current), [])
  useReveal(root, [slug])

  if (!product) {
    return (
      <Container className="page text-center">
        <h1>Fragrance not found</h1>
        <p className="muted">That bottle isn't on our shelves.</p>
        <Button as={Link} to="/shop" className="btn-brass">Back to the shop</Button>
      </Container>
    )
  }

  const size = product.sizes[sizeIdx]
  // where the visitor came from (keeps All / collection / sort); direct visits fall back to the product's collection
  const fromState = location.state?.from
  const backTo = typeof fromState === 'string' && fromState.startsWith('/') ? fromState : `/shop?category=${encodeURIComponent(product.category)}`
  const backParams = new URLSearchParams(backTo.split('?')[1] || '')
  const backLabel = backTo === '/' ? 'Back to home' : backTo.startsWith('/shop') ? (backParams.get('category') ? `Back to ${backParams.get('category')}` : 'Back to all fragrances') : 'Back'
  const related = [
    ...products.filter((p) => p.slug !== slug && p.category === product.category),
    ...products.filter((p) => p.slug !== slug && p.category !== product.category),
  ].slice(0, 4)

  return (
    <div ref={root} className="page" key={slug}>
      <Container>
        <div className="crumbs-row">
          <BackLink to={backTo}>{backLabel}</BackLink>
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link to="/shop">Shop</Link> <span aria-hidden="true">/</span> <span>{product.name}</span>
          </nav>
        </div>
        <Row className="gy-5">
          <Col lg={6}>
            <div className={`product-stage ${product.image ? 'has-photo' : ''}`} data-reveal>
              <ProductVisual product={product} />
            </div>
          </Col>
          <Col lg={6}>
            <div className="product-info">
              <p className="feature__house" data-reveal>{product.house}</p>
              <h1 className="product-title" data-reveal>{product.name}</h1>
              <p className="feature__tag" data-reveal>{product.tagline}</p>
              <p className="product-desc" data-reveal>{product.description}</p>

              <div className="sizes" role="radiogroup" aria-label="Size" data-reveal>
                {product.sizes.map((s, i) => (
                  <button
                    key={s.ml}
                    type="button"
                    role="radio"
                    aria-checked={sizeIdx === i}
                    className={`filter ${sizeIdx === i ? 'is-active' : ''}`}
                    onClick={() => { setSizeIdx(i); setAdded(false) }}
                  >
                    {s.ml} ml
                  </button>
                ))}
              </div>
              <p className="product-price" data-reveal>{peso(size.price)}</p>
              <div className="buyrow" data-reveal>
                <QtyStepper value={qty} onChange={setQty} />
                <Button
                  type="button"
                  className="btn-brass"
                  onClick={() => { add(product.slug, size.ml, qty); setAdded(true); window.clearTimeout(addedTimer.current); addedTimer.current = window.setTimeout(() => setAdded(false), 4000) }}
                >
                  Add to Cart &middot; {peso(size.price * qty)}
                </Button>
              </div>
              <p className="addedmsg" role="status" aria-live="polite">
                {added && <>Added to your cart. <Link to="/cart">View cart</Link> or <Link to="/checkout">check out</Link>.</>}
              </p>

              <dl className="pyramid" data-reveal>
                {TIERS.map(([key, label, hint]) => (
                  <div className="pyramid__row" key={key}>
                    <dt>{label}<small>{hint}</small></dt>
                    <dd>{product.notes[key].join(', ')}</dd>
                  </div>
                ))}
              </dl>
              <p className="muted small" data-reveal>Family: {product.family}</p>
            </div>
          </Col>
        </Row>

        <Divider variant="drop" className="mt-5" />
        <section className="section pb-0 pt-4">
          <h2 className="section-title" data-reveal>More to explore</h2>
          <Row className="g-4 g-xl-5">
            {related.map((p) => (
              <Col key={p.slug} xs={6} lg={3}>
                <ProductCard product={p} from={backTo} />
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </div>
  )
}
