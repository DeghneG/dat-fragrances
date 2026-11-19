import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Divider from '../components/Divider'
import ProductVisual from '../components/ProductVisual'
import QtyStepper from '../components/QtyStepper'
import useReveal from '../hooks/useReveal'
import { useCart } from '../context/CartContext'
import { FREE_SHIPPING_FROM } from '../data/orders'
import { peso } from '../data/products'

export default function Cart() {
  const root = useRef(null)
  const { lines, count, subtotal, setQty, remove, clear } = useCart()
  useReveal(root)

  const toFree = Math.max(0, FREE_SHIPPING_FROM - subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100))

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>Your cart</h1>
          <p className="muted">{count ? `${count} ${count === 1 ? 'bottle' : 'bottles'} ready to order.` : 'Nothing here yet.'}</p>
        </header>
        <Divider variant="ticks" />

        {lines.length === 0 ? (
          <div className="empty" data-reveal>
            <p className="muted">Your cart is empty. Find something to wear.</p>
            <Button as={Link} to="/shop" className="btn-brass">Browse the collection</Button>
          </div>
        ) : (
          <Row className="gy-5">
            <Col lg={8} data-reveal>
              <ul className="lines">
                {lines.map((l) => (
                  <li className="line" key={`${l.slug}-${l.ml}`}>
                    <Link to={`/shop/${l.slug}`} className="line__thumb" aria-label={`${l.product.house} ${l.product.name}`}>
                      <ProductVisual product={l.product} />
                    </Link>
                    <div className="line__main">
                      <p className="line__house">{l.product.house}</p>
                      <Link to={`/shop/${l.slug}`} className="line__name">{l.product.name}</Link>
                      <p className="line__meta">{l.ml} ml &middot; {peso(l.unit)} each</p>
                      <button type="button" className="linkbtn" onClick={() => remove(l.slug, l.ml)}>Remove</button>
                    </div>
                    <QtyStepper value={l.qty} onChange={(q) => setQty(l.slug, l.ml, q)} label={`Quantity for ${l.product.name}`} />
                    <p className="line__total">{peso(l.total)}</p>
                  </li>
                ))}
              </ul>
              <div className="lines__foot">
                <Link to="/shop" className="linkbtn">&larr; Continue shopping</Link>
                <button type="button" className="linkbtn" onClick={clear}>Empty cart</button>
              </div>
            </Col>

            <Col lg={{ span: 4 }} data-reveal>
              <aside className="summary" aria-label="Order summary">
                <h2 className="summary__title">Summary</h2>
                <dl className="summary__rows">
                  <div><dt>Subtotal</dt><dd>{peso(subtotal)}</dd></div>
                  <div><dt>Shipping</dt><dd className="muted">At checkout</dd></div>
                </dl>
                <div className="freebar" aria-live="polite">
                  <p>{toFree > 0 ? <>Add <strong>{peso(toFree)}</strong> for free standard delivery.</> : <strong>You qualify for free standard delivery.</strong>}</p>
                  <div className="freebar__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progress to free shipping"><i style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="summary__total"><span>Total</span><strong>{peso(subtotal)}</strong></div>
                <Button as={Link} to="/checkout" className="btn-brass w-100">Checkout</Button>
                <p className="muted small mb-0 mt-3">Prices in Philippine pesos. Demo store: no real payment is taken.</p>
              </aside>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}
