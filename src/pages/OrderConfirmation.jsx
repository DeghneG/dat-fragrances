import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import Divider from '../components/Divider'
import useReveal from '../hooks/useReveal'
import { PAY_DETAILS, formatDay, getOrder } from '../data/orders'
import { peso } from '../data/products'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { state } = useLocation()
  const root = useRef(null)
  useReveal(root)

  // saved copy first, then the copy passed through navigation (covers blocked storage)
  const order = getOrder(id) || (state?.order?.id === id ? state.order : null)

  if (!order) {
    return (
      <div className="page">
        <Container className="text-center">
          <h1>Order not found</h1>
          <p className="muted">We can only show orders placed on this device. Check the order number and try again.</p>
          <Button as={Link} to="/shop" className="btn-brass">Back to the shop</Button>
        </Container>
      </div>
    )
  }

  const { customer, shipping, payment } = order
  const a = shipping.address
  const pay = PAY_DETAILS[payment.mode]
  const [from, to] = shipping.arrives
  const arrives = shipping.method === 'pickup' ? `Ready ${formatDay(from)}` : from === to ? formatDay(from) : `${formatDay(from)} to ${formatDay(to)}`

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <p className="feature__house">Order placed</p>
          <h1>Thank you, {customer.name.split(' ')[0]}.</h1>
          <p className="muted">
            Your order number is <strong className="ordernum">{order.id}</strong>. We sent the details to {customer.email} (demo only, no email was actually sent).
          </p>
        </header>
        <Divider variant="ticks" />

        <Row className="gy-5">
          <Col lg={7} data-reveal>
            <div className="statusbar">
              <span className={`badge-status ${order.status === 'Processing' ? 'is-ok' : 'is-wait'}`}>{order.status}</span>
              <span className="muted">{shipping.method === 'pickup' ? 'Pickup' : 'Estimated arrival'}: <strong>{arrives}</strong></span>
            </div>

            {pay && (
              <div className="paybox">
                <h2 className="info-head">How to pay</h2>
                <p className="muted">Send <strong>{peso(order.total)}</strong> using the details below and put <strong>{order.id}</strong> as the reference. We hold your bottles for 24 hours.</p>
                <dl className="paydl">
                  <div><dt>{payment.mode === 'bank' ? 'Account name' : 'Name'}</dt><dd>{pay.name}</dd></div>
                  <div><dt>{payment.mode === 'bank' ? 'Account number' : 'Number'}</dt><dd>{pay.number}</dd></div>
                  {pay.bank && <div><dt>Bank</dt><dd>{pay.bank}</dd></div>}
                </dl>
                <p className="muted small mb-0">These are sample details for a class project. Please do not send real money.</p>
              </div>
            )}
            {payment.mode === 'cod' && (
              <div className="paybox">
                <h2 className="info-head">Payment</h2>
                <p className="muted mb-0">{shipping.method === 'pickup' ? 'Pay at the store when you collect.' : 'Pay the courier in cash on delivery.'} Amount due: <strong>{peso(order.total)}</strong>.</p>
              </div>
            )}
            {payment.mode === 'card' && (
              <div className="paybox">
                <h2 className="info-head">Payment</h2>
                <p className="muted mb-0">Paid by card (demo, nothing was charged): <strong>{peso(order.total)}</strong>.</p>
              </div>
            )}

            <div className="twocol">
              <div>
                <h2 className="info-head">{shipping.method === 'pickup' ? 'Pickup at' : 'Deliver to'}</h2>
                {a ? (
                  <address className="muted">
                    {customer.name}<br />
                    {a.line}, {a.barangay}<br />
                    {a.city}, {a.province} {a.postal}<br />
                    {a.region}<br />
                    {customer.mobile}
                  </address>
                ) : (
                  <address className="muted">
                    DAT Fragrances Atelier<br />
                    Unit 5, Aurora Row<br />
                    Leganes, Iloilo<br />
                    Mon to Sat, 10 AM to 7 PM
                  </address>
                )}
                {shipping.notes && <p className="muted small">Note: {shipping.notes}</p>}
              </div>
              <div>
                <h2 className="info-head">Shipping and payment</h2>
                <p className="muted mb-1">{shipping.label}</p>
                <p className="muted">{payment.label}</p>
              </div>
            </div>
          </Col>

          <Col lg={5} data-reveal>
            <aside className="summary" aria-label="Order summary">
              <h2 className="summary__title">Order summary</h2>
              <ul className="mini">
                {order.items.map((it) => (
                  <li key={`${it.slug}-${it.ml}`}>
                    <span className="mini__thumb">{it.image && <img src={it.image} alt="" />}<b>{it.qty}</b></span>
                    <span className="mini__name">{it.name}<small>{it.house} &middot; {it.ml} ml</small></span>
                    <span className="mini__price">{peso(it.unit * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="summary__rows">
                <div><dt>Subtotal</dt><dd>{peso(order.subtotal)}</dd></div>
                <div><dt>{shipping.label}</dt><dd>{shipping.fee === 0 ? 'Free' : peso(shipping.fee)}</dd></div>
              </dl>
              <div className="summary__total"><span>Total</span><strong>{peso(order.total)}</strong></div>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button as={Link} to="/shop" className="btn-brass">Keep shopping</Button>
                <Button type="button" className="btn-ghost" onClick={() => window.print()}>Print</Button>
              </div>
              <p className="muted small mb-0 mt-3">Placed {new Date(order.createdAt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}. Demo store: nothing will be shipped.</p>
            </aside>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
