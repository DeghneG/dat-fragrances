import { useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import AventusScene from '../components/AventusScene'
import ProductVisual from '../components/ProductVisual'
import useReveal from '../hooks/useReveal'
import { bySlug, products, peso } from '../data/products'

const categories = [
  {
    name: 'Middle Eastern',
    slug: 'creed-aventus',
    image: '/images/lattafa-logo.png',
    alt: 'Lattafa logo',
    tagline: 'Oud, amber and incense, worn with presence.',
    description:
      'Rooted in the perfume traditions of Arabia and the Gulf, Middle Eastern fragrances are built around oud, amber, musk, rose, saffron and incense. They are rich, concentrated and long-lasting, often sold as oils or high-concentration extraits, and made to be noticed.',
    notes: 'Oud · Amber · Saffron · Incense',
  },
  {
    name: 'Designer',
    slug: 'mfk-baccarat-rouge-540',
    tagline: 'Dupe houses that are budget friendly.',
    description:
      'Designer fragrances come from established fashion and luxury houses such as Dior, Chanel and Tom Ford.',
    notes: 'Fresh · Spicy · Versatile · Widely loved',
  },
  {
    name: 'Niche',
    slug: 'le-labo-santal-33',
    tagline: 'Small houses, singular ideas.',
    description:
      'Niche fragrances come from independent houses that focus on perfumery itself rather than fashion. Made in smaller batches with distinctive, often unconventional compositions and finer materials, they are more exclusive and far less likely to be smelled on everyone else.',
    notes: 'Distinctive · Small-batch · Exclusive',
  },
]

export default function Home() {
  const root = useRef(null)
  const hero = bySlug('creed-aventus')

  // One authored moment: the hero resolves like a scent opening.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero__line', { yPercent: 110, duration: 1.4, stagger: 0.12 })
          .from('.hero__sub, .hero__cta', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.9')
          .from('.hero__stage', { opacity: 0, filter: 'blur(14px)', duration: 1.8 }, 0.2)
      })
      return () => mm.revert()
    },
    { scope: root },
  )
  useReveal(root)

  return (
    <div ref={root}>
      <section className="hero">
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <h1 className="hero__title">
                <span className="hero__mask"><span className="hero__line">The scent</span></span>
                <span className="hero__mask"><span className="hero__line"><em>is the signature.</em></span></span>
              </h1>
              <p className="hero__sub">
                Eight designer and niche fragrances, read the way enthusiasts read them: top, heart and base.
              </p>
              <div className="hero__cta d-flex flex-wrap gap-3">
                <Button as={Link} to="/shop" className="btn-brass">Explore the collection</Button>
                <Button as={Link} to={`/shop/${hero.slug}`} className="btn-ghost">Discover {hero.name}</Button>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <div className="hero__stage">
                <AventusScene product={hero} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <h2 className="section-title" data-reveal>Featured this season</h2>
          {categories.map((c, i) => {
            const p = bySlug(c.slug)
            return (
              <Row key={c.name} className={`feature align-items-center gy-4 ${i % 2 ? 'flex-lg-row-reverse' : ''}`} data-reveal>
                <Col lg={5} className="text-center">
                  <div className={`feature__stage ${c.image ? 'feature__stage--logo' : p.image ? 'has-photo' : ''}`}>
                    {c.image ? <img src={c.image} alt={c.alt} className="product-photo" /> : <ProductVisual product={p} />}
                  </div>
                </Col>
                <Col lg={{ span: c.image ? 5 : 5, offset: i % 2 ? 0 : c.image ? 1 : 1 }}>
                  <h3 className="feature__name">{c.name}</h3>
                  <p className="feature__tag">{c.tagline}</p>
                  <p className="feature__desc">{c.description}</p>
                  <p className="feature__notes">{c.notes}</p>
                  <Button as={Link} to="/shop" className="btn-brass">Browse the collection</Button>
                </Col>
              </Row>
            )
          })}
        </Container>
      </section>

      <section className="section section--index">
        <Container>
          <h2 className="section-title" data-reveal>The full index</h2>
          <ul className="index-list list-unstyled">
            {products.map((p) => (
              <li key={p.slug} data-reveal>
                <Link to={`/shop/${p.slug}`}>
                  <span className="index-list__name">{p.house} <em>{p.name}</em></span>
                  <span className="index-list__base">{p.notes.base.slice(0, 2).join(', ')}</span>
                  <span className="index-list__price">{peso(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="text-center mt-5" data-reveal>
            <Button as={Link} to="/shop" className="btn-ghost">Shop all fragrances</Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
