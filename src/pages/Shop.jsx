import { useMemo, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Divider from '../components/Divider'
import useReveal from '../hooks/useReveal'
import { products } from '../data/products'

const CATEGORIES = ['All', 'Middle Eastern', 'Designer', 'Niche']

// lower-case and strip accents so 'gio' finds Giò and 'millesime' finds Millésime
const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const haystack = (p) => norm([p.house, p.name, p.family, p.category, ...(p.notes?.top || []), ...(p.notes?.heart || []), ...(p.notes?.base || [])].join(' '))

const SORTS = {
  featured: { label: 'Featured', fn: null },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  'name-asc': { label: 'Name: A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
  'name-desc': { label: 'Name: Z to A', fn: (a, b) => b.name.localeCompare(a.name) },
  'house-asc': { label: 'House: A to Z', fn: (a, b) => a.house.localeCompare(b.house) || a.name.localeCompare(b.name) },
}

export default function Shop() {
  const root = useRef(null)
  // filter and sort live in the URL (?category=Niche&sort=price-asc) so links and refreshes keep them
  const [params, setParams] = useSearchParams()
  const askedCat = params.get('category')
  const askedSort = params.get('sort')
  const filter = CATEGORIES.includes(askedCat) ? askedCat : 'All'
  const sort = Object.hasOwn(SORTS, askedSort) ? askedSort : 'featured'
  // the box keeps its own text so fast typing never drops characters; the URL just mirrors it
  const [q, setQ] = useState(params.get('q') || '')

  const update = (next) => {
    if ('q' in next) setQ(next.q)
    const merged = { category: filter, sort, q, ...next }
    const out = {}
    if (merged.category !== 'All') out.category = merged.category
    if (merged.sort !== 'featured') out.sort = merged.sort
    if (merged.q.trim()) out.q = merged.q
    setParams(out, { replace: true })
  }

  const list = useMemo(() => {
    let base = filter === 'All' ? products : products.filter((p) => p.category === filter)
    const terms = norm(q).split(/\s+/).filter(Boolean)
    if (terms.length) base = base.filter((p) => { const h = haystack(p); return terms.every((t) => h.includes(t)) })
    const fn = SORTS[sort].fn
    return fn ? [...base].sort(fn) : base
  }, [filter, sort, q])
  useReveal(root, [filter, sort])

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>The collection</h1>
          <p className="muted">{products.length} bottles across designer, Middle Eastern and niche houses. Choose one to read its notes.</p>
        </header>
        <Divider variant="ticks" />
        <div className="filterbar" data-reveal>
          <div className="searchbox" role="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
            <input
              type="search"
              className="searchbox__input"
              placeholder="Search by name, house or note"
              aria-label="Search fragrances"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Escape' && q) update({ q: '' }) }}
              autoComplete="off"
              spellCheck="false"
            />
            {q && (
              <button type="button" className="searchbox__clear" onClick={() => update({ q: '' })} aria-label="Clear search">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            )}
          </div>
          <div className="filters" role="group" aria-label="Filter by collection">
            {CATEGORIES.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter ${filter === f ? 'is-active' : ''}`}
                aria-pressed={filter === f}
                onClick={() => update({ category: f })}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="filterbar__right">
            <p className="filterbar__count" aria-live="polite">{list.length} fragrances</p>
            <label className="sortbox">
              <span className="sortbox__label">Sort</span>
              <select className="sortselect" value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort fragrances">
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <Row className="g-4 g-xl-5" key={`${filter}-${sort}`}>
          {list.map((p) => (
            <Col key={p.slug} xs={6} lg={4} xl={3}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
        {list.length === 0 && (
          <div className="noresults">
            <p className="muted">{q.trim() ? `Nothing matches “${q.trim()}”${filter === 'All' ? '' : ` in ${filter}`}.` : 'Nothing in this collection yet.'}</p>
            {(q.trim() || filter !== 'All') && (
              <button type="button" className="btn-ghost btn" onClick={() => update({ q: '', category: 'All' })}>Clear search and filters</button>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
