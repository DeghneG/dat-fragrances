import { Fragment, useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import HeroCarousel from '../components/heroes/HeroCarousel'
import HouseIntro from '../components/HouseIntro'
import Divider from '../components/Divider'
import Marquee from '../components/Marquee'
import ProductVisual from '../components/ProductVisual'
import useReveal from '../hooks/useReveal'
import { bySlug } from '../data/products'

const categories = [
  {
    name: 'Middle Eastern',
    slug: 'creed-aventus',
    image: '/images/lattafa-logo.png',
    alt: 'Lattafa logo',
    tagline: 'Dupe houses that are budget friendly.',
    description:
      'Middle Eastern fragrances are mainly made by dupe houses that offer scents similar to designer and niche fragrances at more affordable prices.',
  },
  {
    name: 'Designer',
    slug: 'mfk-baccarat-rouge-540',
    image: '/images/ysl-logo.png',
    alt: 'Yves Saint Laurent logo',
    tagline: 'Fashion-house icons, made for everyone.',
    description:
      'Designer fragrances come from established fashion and luxury houses such as Dior, Chanel and Tom Ford.',
  },
  {
    name: 'Niche',
    slug: 'le-labo-santal-33',
    image: '/images/amouage-logo.png',
    alt: 'Amouage logo',
    tagline: 'Small houses, singular ideas.',
    description:
      'Niche fragrances come from independent houses that focus on perfumery itself, with smaller batches, distinctive compositions and finer materials.',
  },
]

export default function Home() {
  const root = useRef(null)
  const hero = bySlug('creed-aventus')

  useReveal(root)

  return (
    <div ref={root}>
      <HeroCarousel />

      <Marquee />

      <HouseIntro product={hero} />

      <section className="section pt-4">
        <Container>
          <h2 className="section-title" data-reveal>Featured this season</h2>
          {categories.map((c, i) => {
            const p = bySlug(c.slug)
            return (
              <Fragment key={c.name}>
                {i > 0 && <Divider variant="drop" />}
              <Row className={`feature align-items-center gy-4 ${i % 2 ? 'flex-lg-row-reverse' : ''}`} data-reveal>
                <Col lg={5} className="text-center">
                  <div className={`feature__stage ${c.image ? 'feature__stage--logo' : p.image ? 'has-photo' : ''}`}>
                    {c.image ? <img src={c.image} alt={c.alt} className="product-photo" /> : <ProductVisual product={p} />}
                  </div>
                </Col>
                <Col lg={{ span: c.image ? 5 : 5, offset: i % 2 ? 0 : c.image ? 1 : 1 }}>
                  <h3 className="feature__name">{c.name}</h3>
                  <p className="feature__tag">{c.tagline}</p>
                  <p className="feature__desc">{c.description}</p>
                  <Button as={Link} to={`/shop?category=${encodeURIComponent(c.name)}`} className="btn-brass">Browse the collection</Button>
                </Col>
              </Row>
              </Fragment>
            )
          })}
        </Container>
      </section>
    </div>
  )
}
