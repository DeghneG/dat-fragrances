import { Link, useLocation } from 'react-router-dom'
import ProductVisual from './ProductVisual'
import { peso } from '../data/products'

const tier = (list) => list.slice(0, 2).join(', ')

export default function ProductCard({ product, from }) {
  const location = useLocation()
  const origin = from ?? location.pathname + location.search
  const { top, heart, base } = product.notes
  return (
    <Link to={`/shop/${product.slug}`} state={{ from: origin }} className="product-card" data-reveal>
      <div className={`product-card__stage ${product.image ? 'has-photo' : ''}`}>
        <ProductVisual product={product} />
        <dl className="product-card__notes" aria-hidden="true">
          <div><dt>Top</dt><dd>{tier(top)}</dd></div>
          <div><dt>Heart</dt><dd>{tier(heart)}</dd></div>
          <div><dt>Base</dt><dd>{tier(base)}</dd></div>
        </dl>
      </div>
      <div className="product-card__meta">
        <p className="product-card__house">{product.house}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__family">{product.family}</p>
        <p className="product-card__price">
          <span>from</span> {peso(product.price)}
        </p>
        <span className="product-card__link">View fragrance</span>
      </div>
    </Link>
  )
}
