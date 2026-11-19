import { useEffect, useRef, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AventusScene from './AventusScene'
import { useCart } from '../context/CartContext'
import { peso, products } from '../data/products'

// Feature section: the house-first pitch, with the draggable 3D Aventus as a small featured tile.
export default function HouseIntro({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const size = product.sizes[0]
  const facts = [
    [products.length, 'Fragrances'],
    [new Set(products.map((p) => p.house)).size, 'Houses'],
    [new Set(products.map((p) => p.category)).size, 'Kinds of house'],
  ]

  return (
    <section className="hi">
      <Container>
        <div className="hi__top">
          <div>
            <h2 className="hi__title" data-reveal>Start with <em>the house.</em></h2>
            <p className="hi__sub" data-reveal>
              Middle Eastern, designer and niche fragrances, laid out the way enthusiasts shop them.
            </p>
            <div className="d-flex flex-wrap gap-3" data-reveal>
              <Button as={Link} to="/shop" className="btn-brass">Explore the collection</Button>
              <Button as={Link} to="/about" className="btn-ghost">Who we are</Button>
            </div>
          </div>

          <aside className="hi__feature" data-reveal aria-label="Featured fragrance">
            <span className="hi__corner hi__corner--tl" aria-hidden="true" />
            <span className="hi__corner hi__corner--br" aria-hidden="true" />
            <div className="hi__stage">
              <span className="hi__ring" aria-hidden="true" />
              <span className="hi__ring hi__ring--b" aria-hidden="true" />
              <AventusScene product={product} />
              <span className="hi__drag" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" /></svg>
                Drag to rotate
              </span>
            </div>
            <div className="hi__cap">
              <p className="hi__eyebrow"><span>Featured</span><span>{product.family}</span></p>
              <h3 className="hi__name">{product.name}</h3>
              <p className="hi__house">{product.house}</p>
              <p className="hi__tag">{product.tagline}</p>
              <dl className="hi__notes">
                {[['Top', product.notes.top], ['Heart', product.notes.heart], ['Base', product.notes.base]].map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v.slice(0, 3).join(' \u00b7 ')}</dd></div>
                ))}
              </dl>
              <p className="hi__price"><small>from</small> {peso(size.price)} <small>/ {size.ml} ml</small></p>
              <div className="hi__actions">
                <Button
                  type="button"
                  className="btn-brass"
                  onClick={() => { add(product.slug, size.ml, 1); setAdded(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setAdded(false), 2500) }}
                >
                  {added ? 'Added \u2713' : 'Add to cart'}
                </Button>
                <Link to={`/shop/${product.slug}`} className="hi__more">Discover</Link>
              </div>
              <p className="hi__status" role="status" aria-live="polite">{added && <>In your cart. <Link to="/cart">View cart</Link></>}</p>
            </div>
          </aside>
        </div>

        <dl className="hi__facts" data-reveal>
          {facts.map(([n, label]) => (
            <div key={label}>
              <dt>{n}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
