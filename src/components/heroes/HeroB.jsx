import { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AventusScene from '../AventusScene'
import Motes from '../Motes'
import useHeroIn from './useHeroIn'
import { peso } from '../../data/products'

// B: Poster. The bottle stands in front of a giant outlined wordmark, text pinned to the corners.
export default function HeroB({ product }) {
  const root = useRef(null)
  useHeroIn(root)
  return (
    <section className="hb" ref={root}>
      <Motes count={40} />
      <div className="hb__word" aria-hidden="true" data-fade>AVENTUS</div>
      <div className="hb__stage" data-fade>
        <AventusScene product={product} />
      </div>

      <div className="hb__top" data-in>
        <span>{product.house}</span>
        <span>The signature fragrance</span>
      </div>

      <div className="hb__left" data-in>
        <h1 className="hb__title">The scent <em>is the signature.</em></h1>
        <p>Designer, Middle Eastern and niche fragrances, read the way enthusiasts read them: top, heart and base.</p>
      </div>

      <div className="hb__right" data-in>
        <p className="hb__price"><span>from</span> {peso(product.price)}</p>
        <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
          <Button as={Link} to={`/shop/${product.slug}`} className="btn-brass">Discover {product.name}</Button>
          <Button as={Link} to="/shop" className="btn-ghost">Explore the collection</Button>
        </div>
      </div>
    </section>
  )
}
