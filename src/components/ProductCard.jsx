import { Link } from 'react-router-dom'
import ProductVisual from './ProductVisual'
import { peso } from '../data/products'

export default function ProductCard({ product }) {
  return (
    <Link to={`/shop/${product.slug}`} className="product-card" data-reveal>
      <div className={`product-card__stage ${product.image ? 'has-photo' : ''}`}>
        <ProductVisual product={product} />
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
