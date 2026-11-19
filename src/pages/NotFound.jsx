import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'

export default function NotFound() {
  return (
    <Container className="page notfound">
      <BackLink to="/">Back to home</BackLink>
      <h1 className="notfound__title">This page has evaporated.</h1>
      <p className="muted">The address you followed isn't on our shelves. Try the collection instead.</p>
      <Button as={Link} to="/shop" className="btn-brass">Browse the collection</Button>
    </Container>
  )
}
