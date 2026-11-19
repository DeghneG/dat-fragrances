import { useRef, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Divider from '../components/Divider'
import ProductVisual from '../components/ProductVisual'
import useReveal from '../hooks/useReveal'
import { useCart } from '../context/CartContext'
import { PAYMENTS, REGIONS, SHIPPING, addBusinessDays, makeOrderId, paymentById, regionByValue, saveOrder, shippingById } from '../data/orders'
import { peso } from '../data/products'

const EMPTY = {
  name: '', email: '', mobile: '',
  address: '', barangay: '', city: '', province: '', postal: '', region: 'visayas', notes: '',
  shipping: 'standard', payment: 'cod',
  cardName: '', cardNumber: '', cardExp: '', cardCvc: '',
}

const digits = (s) => s.replace(/\D/g, '')

function validate(v) {
  const e = {}
  const pickup = v.shipping === 'pickup'
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email, like name@email.com.'
  if (!/^(09\d{9}|\+639\d{9})$/.test(v.mobile.replace(/[\s-]/g, ''))) e.mobile = 'Enter a Philippine mobile number, like 0917 123 4567.'
  if (!pickup) {
    if (v.address.trim().length < 5) e.address = 'Enter your house number and street.'
    if (!v.barangay.trim()) e.barangay = 'Enter your barangay.'
    if (!v.city.trim()) e.city = 'Enter your city or municipality.'
    if (!v.province.trim()) e.province = 'Enter your province.'
    if (!/^\d{4}$/.test(v.postal.trim())) e.postal = 'Postal codes have 4 digits.'
  }
  if (v.payment === 'card') {
    if (v.cardName.trim().length < 2) e.cardName = 'Enter the name on the card.'
    const n = digits(v.cardNumber)
    if (n.length < 13 || n.length > 19) e.cardNumber = 'Enter the card number (13 to 19 digits).'
    const m = v.cardExp.match(/^(\d{2})\/(\d{2})$/)
    const now = new Date()
    const expired = m && (2000 + Number(m[2]) < now.getFullYear() || (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1))
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12 || expired) e.cardExp = 'Enter a future date as MM/YY.'
    if (!/^\d{3,4}$/.test(v.cardCvc)) e.cardCvc = 'Enter the 3 or 4 digit code.'
  }
  return e
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={`f-${id}`}>{label}</label>
      {children}
      {hint && !error && <p className="field__hint" id={`h-${id}`}>{hint}</p>}
      {error && <p className="field__error" id={`e-${id}`} role="alert">{error}</p>}
    </div>
  )
}

export default function Checkout() {
  const root = useRef(null)
  const navigate = useNavigate()
  const { lines, count, subtotal, clear } = useCart()
  const [v, setV] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  useReveal(root)

  const errors = validate(v)
  const show = (k) => (submitted || touched[k] ? errors[k] : undefined)
  const set = (k, val) => setV((p) => ({ ...p, [k]: val }))
  const bind = (k) => ({
    id: `f-${k}`,
    value: v[k],
    onChange: (e) => set(k, e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    'aria-invalid': show(k) ? 'true' : undefined,
    'aria-describedby': show(k) ? `e-${k}` : undefined,
  })

  const pickup = v.shipping === 'pickup'
  const region = regionByValue(v.region)
  const ship = shippingById(v.shipping)
  const shipFee = ship.fee(region, subtotal)
  const total = subtotal + shipFee
  const pay = paymentById(v.payment)

  const place = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const firstBad = Object.keys(errors)[0]
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus()
      return
    }
    setPlacing(true)
    const now = new Date()
    const order = {
      id: makeOrderId(),
      createdAt: now.toISOString(),
      items: lines.map((l) => ({ slug: l.slug, house: l.product.house, name: l.product.name, ml: l.ml, qty: l.qty, unit: l.unit, image: l.product.image || null })),
      customer: { name: v.name.trim(), email: v.email.trim(), mobile: v.mobile.trim() },
      shipping: {
        method: ship.id,
        label: ship.label,
        fee: shipFee,
        arrives: [addBusinessDays(now, ship.days[0]).toISOString(), addBusinessDays(now, ship.days[1]).toISOString()],
        address: pickup
          ? null
          : { line: v.address.trim(), barangay: v.barangay.trim(), city: v.city.trim(), province: v.province.trim(), postal: v.postal.trim(), region: region.label },
        notes: v.notes.trim(),
      },
      // card details are never stored: only the mode is kept
      payment: { mode: pay.id, label: pickup && pay.pickupLabel ? pay.pickupLabel : pay.label },
      subtotal,
      total,
      status: pay.id === 'cod' || pay.id === 'card' ? 'Processing' : 'Awaiting payment',
    }
    saveOrder(order)
    navigate(`/order/${order.id}`, { replace: true, state: { order } })
    clear()
  }

  if (!placing && lines.length === 0) {
    return (
      <div className="page">
        <Container>
          <header className="page-head"><h1>Checkout</h1></header>
          <div className="empty">
            <p className="muted">Your cart is empty, so there is nothing to check out.</p>
            <Button as={Link} to="/shop" className="btn-brass">Browse the collection</Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>Checkout</h1>
          <p className="muted">Three short steps: who you are, where it goes, how you pay.</p>
        </header>
        <Divider variant="ticks" />

        <form onSubmit={place} noValidate className="checkout">
          <Row className="gy-5">
            <Col lg={7}>
              <fieldset className="step" data-reveal>
                <legend><span>1</span> Contact</legend>
                <Field id="name" label="Full name" error={show('name')}>
                  <input type="text" autoComplete="name" {...bind('name')} />
                </Field>
                <Row className="g-3">
                  <Col sm={6}>
                    <Field id="email" label="Email" error={show('email')}>
                      <input type="email" autoComplete="email" inputMode="email" {...bind('email')} />
                    </Field>
                  </Col>
                  <Col sm={6}>
                    <Field id="mobile" label="Mobile number" error={show('mobile')}>
                      <input type="tel" autoComplete="tel" inputMode="tel" placeholder="0917 123 4567" {...bind('mobile')} />
                    </Field>
                  </Col>
                </Row>
              </fieldset>

              <fieldset className="step" data-reveal>
                <legend><span>2</span> Shipping</legend>
                <div className="choices" role="radiogroup" aria-label="Shipping method">
                  {SHIPPING.map((s) => {
                    const fee = s.fee(region, subtotal)
                    return (
                      <label key={s.id} className={`choice ${v.shipping === s.id ? 'is-on' : ''}`}>
                        <input type="radio" name="shipping" value={s.id} checked={v.shipping === s.id} onChange={() => set('shipping', s.id)} />
                        <span className="choice__body">
                          <strong>{s.label}</strong>
                          <small>{s.note}</small>
                        </span>
                        <span className="choice__price">{fee === 0 ? 'Free' : peso(fee)}</span>
                      </label>
                    )
                  })}
                </div>

                {!pickup && (
                  <div className="address">
                    <Field id="address" label="House number and street" error={show('address')}>
                      <input type="text" autoComplete="address-line1" {...bind('address')} />
                    </Field>
                    <Row className="g-3">
                      <Col sm={6}>
                        <Field id="barangay" label="Barangay" error={show('barangay')}>
                          <input type="text" autoComplete="address-line2" {...bind('barangay')} />
                        </Field>
                      </Col>
                      <Col sm={6}>
                        <Field id="city" label="City or municipality" error={show('city')}>
                          <input type="text" autoComplete="address-level2" {...bind('city')} />
                        </Field>
                      </Col>
                      <Col sm={6}>
                        <Field id="province" label="Province" error={show('province')}>
                          <input type="text" autoComplete="address-level1" {...bind('province')} />
                        </Field>
                      </Col>
                      <Col sm={3} xs={6}>
                        <Field id="postal" label="Postal code" error={show('postal')}>
                          <input type="text" inputMode="numeric" maxLength={4} autoComplete="postal-code" {...bind('postal')} />
                        </Field>
                      </Col>
                      <Col sm={3} xs={6}>
                        <Field id="region" label="Island group">
                          <select {...bind('region')}>
                            {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                        </Field>
                      </Col>
                    </Row>
                    <Field id="notes" label="Delivery notes (optional)" hint="Landmarks, gate codes, best time to call.">
                      <textarea rows={2} {...bind('notes')} />
                    </Field>
                  </div>
                )}
                {pickup && (
                  <p className="pickup muted">
                    Collect at <strong>DAT Fragrances Atelier</strong>, Unit 5, Aurora Row, Leganes, Iloilo. Mon to Sat, 10 AM to 7 PM. Bring your order number and a valid ID.
                  </p>
                )}
              </fieldset>

              <fieldset className="step" data-reveal>
                <legend><span>3</span> Payment</legend>
                <div className="choices" role="radiogroup" aria-label="Mode of payment">
                  {PAYMENTS.map((p) => (
                    <label key={p.id} className={`choice ${v.payment === p.id ? 'is-on' : ''}`}>
                      <input type="radio" name="payment" value={p.id} checked={v.payment === p.id} onChange={() => set('payment', p.id)} />
                      <span className="choice__body">
                        <strong>{pickup && p.pickupLabel ? p.pickupLabel : p.label}</strong>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="paynote muted">{pickup && pay.pickupBlurb ? pay.pickupBlurb : pay.blurb}</p>

                {v.payment === 'card' && (
                  <div className="cardbox">
                    <Field id="cardName" label="Name on card" error={show('cardName')}>
                      <input type="text" autoComplete="cc-name" {...bind('cardName')} />
                    </Field>
                    <Field id="cardNumber" label="Card number" error={show('cardNumber')}>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="4242 4242 4242 4242"
                        {...bind('cardNumber')}
                        onChange={(e) => set('cardNumber', digits(e.target.value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim())}
                      />
                    </Field>
                    <Row className="g-3">
                      <Col xs={6}>
                        <Field id="cardExp" label="Expiry" error={show('cardExp')}>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM/YY"
                            maxLength={5}
                            {...bind('cardExp')}
                            onChange={(e) => {
                              const d = digits(e.target.value).slice(0, 4)
                              set('cardExp', d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                            }}
                          />
                        </Field>
                      </Col>
                      <Col xs={6}>
                        <Field id="cardCvc" label="Security code" error={show('cardCvc')}>
                          <input type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} {...bind('cardCvc')} onChange={(e) => set('cardCvc', digits(e.target.value).slice(0, 4))} />
                        </Field>
                      </Col>
                    </Row>
                    <p className="muted small mb-0">Demo only. Please do not enter a real card number. Card details are never saved or sent anywhere.</p>
                  </div>
                )}
              </fieldset>
            </Col>

            <Col lg={5}>
              <aside className="summary summary--sticky" aria-label="Order summary" data-reveal>
                <h2 className="summary__title">Your order <small>({count})</small></h2>
                <ul className="mini">
                  {lines.map((l) => (
                    <li key={`${l.slug}-${l.ml}`}>
                      <span className="mini__thumb"><ProductVisual product={l.product} /><b>{l.qty}</b></span>
                      <span className="mini__name">{l.product.name}<small>{l.product.house} &middot; {l.ml} ml</small></span>
                      <span className="mini__price">{peso(l.total)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="summary__rows">
                  <div><dt>Subtotal</dt><dd>{peso(subtotal)}</dd></div>
                  <div><dt>{ship.label}</dt><dd>{shipFee === 0 ? 'Free' : peso(shipFee)}</dd></div>
                </dl>
                <div className="summary__total"><span>Total</span><strong>{peso(total)}</strong></div>
                {submitted && Object.keys(errors).length > 0 && (
                  <p className="field__error" role="alert">Please fix {Object.keys(errors).length === 1 ? 'the highlighted field' : `${Object.keys(errors).length} highlighted fields`} to continue.</p>
                )}
                <Button type="submit" className="btn-brass w-100" disabled={placing}>Place order &middot; {peso(total)}</Button>
                <p className="muted small mb-0 mt-3">By placing this order you agree this is a demo store. No payment is taken and nothing will be shipped.</p>
                <Link to="/cart" className="linkbtn d-inline-block mt-3">&larr; Back to cart</Link>
              </aside>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  )
}
