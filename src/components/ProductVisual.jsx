import Bottle from './Bottle'

// Shows the product photo when one exists, otherwise the placeholder bottle.
export default function ProductVisual({ product, className = '' }) {
  const title = `${product.house} ${product.name} bottle`
  if (product.image) {
    return <img src={product.image} alt={title} className={`product-photo ${className}`} style={product.imageFilter ? { filter: product.imageFilter } : undefined} />
  }
  return <Bottle className={className} shape={product.shape} tint={product.tint} title={title} />
}
