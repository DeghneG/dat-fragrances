import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact Us' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
