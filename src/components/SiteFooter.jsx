import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const year = new Date().getFullYear()

export default function SiteFooter() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      setSent(true)
      e.currentTarget.reset()
    }
  }

  return (
    <footer className="site-footer foot">
      <Container>
        <Row className="foot__top gy-5 align-items-end">
          <Col lg={6}>
            <h2 className="foot__headline">
              Notes worth <em>wearing</em>,<br />delivered quietly.
            </h2>
          </Col>
          <Col lg={{ span: 5, offset: 1 }}>
            <Form onSubmit={onSubmit} className="foot__form" aria-label="Newsletter sign-up">
              <Form.Label htmlFor="foot-email" className="foot__label">Join the note letter</Form.Label>
              <div className="foot__field">
                <Form.Control id="foot-email" type="email" required placeholder="your@email.com" autoComplete="email" />
                <Button type="submit" className="btn-brass">Subscribe</Button>
              </div>
              <p className="foot__hint" aria-live="polite">
                {sent ? 'Thank you. You are on the list (demo only, nothing was sent).' : 'New arrivals and what we are wearing. No noise.'}
              </p>
            </Form>
          </Col>
        </Row>

        <Row className="foot__cols gy-4">
          <Col md={4}>
            <p className="wordmark mb-2">
              DAT <span>Fragrances</span>
            </p>
            <p className="muted mb-0">Designer, niche and Middle Eastern fragrances, chosen by people who actually wear them.</p>
          </Col>
          <Col xs={6} md={2}>
            <h3 className="footer-head">Explore</h3>
            <ul className="list-unstyled mb-0">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={2}>
            <h3 className="footer-head">Collections</h3>
            <ul className="list-unstyled mb-0">
              <li><Link to="/shop?category=Middle%20Eastern">Middle Eastern</Link></li>
              <li><Link to="/shop?category=Designer">Designer</Link></li>
              <li><Link to="/shop?category=Niche">Niche</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h3 className="footer-head">Visit</h3>
            <address className="muted mb-2">
              DAT Fragrances Atelier<br />
              Unit 5, Aurora Row<br />
              Leganes, Iloilo
            </address>
            <p className="muted mb-0">Mon to Sat, 10 AM to 7 PM</p>
          </Col>
        </Row>
      </Container>

      <div className="foot__mark" aria-hidden="true">DAT Fragrances</div>

      <Container>
        <div className="foot__bar">
          <p className="mb-0">
            &copy; {year} DAT Fragrances. An academic project: a hypothetical store with fictional prices. Brand names belong to their owners.
          </p>
          <p className="mb-0">Developed by Deghne Agana &middot; Theodore Navarro &middot; Alexander Tolosa</p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top &uarr;</a>
        </div>
      </Container>
    </footer>
  )
}
