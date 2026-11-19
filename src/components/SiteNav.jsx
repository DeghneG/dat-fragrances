import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact Us' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  return (
    <Navbar expand="md" expanded={open} onToggle={setOpen} className="site-nav" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setOpen(false)} className="wordmark">
          DAT <span>Fragrances</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-menu" aria-label="Toggle menu" />
        <Navbar.Collapse id="main-menu">
          <Nav className="ms-auto align-items-md-center">
            {links.map((l) => (
              <Nav.Link
                key={l.to}
                as={NavLink}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Nav.Link>
            ))}
            <Nav.Link as={NavLink} to="/cart" onClick={() => setOpen(false)} className="cartlink" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
              <span className="cartlink__text">Cart</span>
              {count > 0 && <b className="cartlink__count" key={count}>{count}</b>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
