import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-4">
          <Col md={5}>
            <p className="wordmark mb-2">
              DAT <span>Fragrances</span>
            </p>
            <p className="muted mb-0">Designer and niche fragrances, chosen by people who actually wear them.</p>
          </Col>
          <Col xs={6} md={3}>
            <h2 className="footer-head">Explore</h2>
            <ul className="list-unstyled mb-0">
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
            <h2 className="footer-head">Developed by</h2>
            <ul className="list-unstyled mb-0 muted">
              <li>Deghne Agana</li>
              <li>Theodore Navarro</li>
              <li>Alexander Tolosa</li>
            </ul>
          </Col>
        </Row>
        <p className="footer-fine">
          &copy; {new Date().getFullYear()} DAT Fragrances. An academic project: this is a hypothetical store, prices are
          fictional, and brand names belong to their owners.
        </p>
      </Container>
    </footer>
  )
}
