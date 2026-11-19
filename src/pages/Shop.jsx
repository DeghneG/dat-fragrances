import { useMemo, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import useReveal from '../hooks/useReveal'
import { products } from '../data/products'

const FAMILIES = ['All', 'Woody', 'Fresh & Aromatic', 'Amber & Spice', 'Floral & Fruity']
const MAP = {
  Woody: ['Woody Oriental', 'Woody Leather'],
  'Fresh & Aromatic': ['Woody Aromatic', 'Fruity Chypre'],
  'Amber & Spice': ['Spicy Lavender', 'Vanilla Spicy'],
  'Floral & Fruity': ['Amber Floral'],
}

export default function Shop() {
  const root = useRef(null)
  const [filter, setFilter] = useState('All')
  const list = useMemo(
    () => (filter === 'All' ? products : products.filter((p) => MAP[filter].includes(p.family))),
    [filter],
  )
  useReveal(root, [filter])

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>The collection</h1>
          <p className="muted">Eight bottles we reach for. Choose one to read its notes.</p>
        </header>
        <div className="filters" role="group" aria-label="Filter by scent family" data-reveal>
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter ${filter === f ? 'is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <Row className="g-4 g-xl-5" key={filter}>
          {list.map((p) => (
            <Col key={p.slug} xs={6} lg={4} xl={3}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
        {list.length === 0 && <p className="muted">Nothing in this family yet.</p>}
      </Container>
    </div>
  )
}
