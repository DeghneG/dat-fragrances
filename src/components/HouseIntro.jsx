import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AventusScene from './AventusScene'
import { peso, products } from '../data/products'

// Feature section: the house-first pitch, with the draggable 3D Aventus as a small featured tile.
export default function HouseIntro({ product }) {
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
            <div className="hi__stage"><AventusScene product={product} /></div>
            <div className="hi__cap">
              <span>Featured</span>
              <strong>{product.house} {product.name}</strong>
              <em>{peso(product.price)} · drag to rotate</em>
              <Link to={`/shop/${product.slug}`}>Discover</Link>
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
