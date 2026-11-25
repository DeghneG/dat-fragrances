import { useRef, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import Divider from '../components/Divider'
import useReveal from '../hooks/useReveal'

export default function Contact() {
  const root = useRef(null)
  const [validated, setValidated] = useState(false)
  const [sent, setSent] = useState(false)
  useReveal(root)

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setValidated(true)
    if (form.checkValidity()) {
      setSent(true)
      form.reset()
      setValidated(false)
    }
  }

  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>Contact us</h1>
          <p className="muted">Questions about a scent, an order, or what to wear on Friday? Write to us.</p>
        </header>
        <Divider variant="ticks" />
        <Row className="gy-5">
          <Col lg={5} data-reveal>
            <h2 className="info-head">Visit</h2>
            <address className="muted">
              DAT Fragrances Atelier<br />
              Unit 5, Aurora Row<br />
              Leganes, Iloilo
            </address>
            <h2 className="info-head">Hours</h2>
            <p className="muted">Mon to Sat, 10 AM to 7 PM<br />Sunday, by appointment</p>
            <h2 className="info-head">Reach us</h2>
            <p className="muted mb-0">
              <a href="mailto:hello@datfragrances.example">hello@datfragrances.example</a><br />
              <a href="tel:+639000000000">+63 900 000 0000</a>
            </p>
            <iframe
              title="Map of DAT Fragrances Atelier in Leganes, Iloilo"
              src="https://www.google.com/maps?q=Leganes,+Iloilo,+Philippines&output=embed"
              className="w-100 mt-4 border-0 rounded"
              height="220"
              loading="lazy"
            />
            <p className="muted small mt-4">Hypothetical contact details for a class project.</p>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} data-reveal>
            {sent && (
              <Alert variant="success" className="mb-4" dismissible onClose={() => setSent(false)}>
                Thank you. Your message is on its way (demo only, nothing was sent).
              </Alert>
            )}
            <Form noValidate validated={validated} onSubmit={onSubmit} className="contact-form">
              <Form.Group className="mb-4" controlId="cName">
                <Form.Label>Name</Form.Label>
                <Form.Control required type="text" autoComplete="name" />
                <Form.Control.Feedback type="invalid">Please tell us your name.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4" controlId="cEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" autoComplete="email" />
                <Form.Control.Feedback type="invalid">Enter a valid email so we can reply.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4" controlId="cMsg">
                <Form.Label>Message</Form.Label>
                <Form.Control required as="textarea" rows={5} />
                <Form.Control.Feedback type="invalid">Write a short message.</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" className="btn-brass">Send message</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
