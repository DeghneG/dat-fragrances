import { useRef } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Divider from '../components/Divider'
import useReveal from '../hooks/useReveal'

const team = [
  { name: 'Deghne Agana', photo: '/images/team/deghne-agana.png', role: 'Co-founder', bio: 'Keeps the collection honest. If a bottle makes the shelf, Deghne has worn it through a full week.' },
  { name: 'Theodore Navarro', photo: '/images/team/theodore-navarro.png', role: 'Co-founder', bio: 'Our resident note-spotter, equally happy in a department-store aisle or a niche boutique.' },
  { name: 'Alexander Tolosa', photo: '/images/team/alexander-tolosa.png', role: 'Co-founder', bio: 'Turns obsessive scent talk into clear product pages and a shop that is easy to browse.' },
]

export default function About() {
  const root = useRef(null)
  useReveal(root)
  return (
    <div ref={root} className="page">
      <Container>
        <header className="page-head" data-reveal>
          <h1>About us</h1>
          <p className="muted">Three friends, one shelf that got out of hand.</p>
        </header>
        <Divider variant="ticks" />

        <Row className="gy-4 mb-5">
          {team.map((m) => (
            <Col md={4} key={m.name} data-reveal>
              <div className="member">
                <img className="member__photo" src={m.photo} alt={m.name} loading="lazy" />
                <h2 className="member__name">{m.name}</h2>
                <p className="member__role">{m.role}</p>
                <p className="muted mb-0">{m.bio}</p>
              </div>
            </Col>
          ))}
        </Row>

        <section className="nameorigin" aria-labelledby="name-origin" data-reveal>
          <h2 id="name-origin" className="nameorigin__title">What DAT stands for</h2>
          <ul className="nameorigin__letters">
            <li><span aria-hidden="true">D</span><strong>Deghne</strong></li>
            <li><span aria-hidden="true">A</span><strong>Alex</strong></li>
            <li><span aria-hidden="true">T</span><strong>Theodore</strong></li>
          </ul>
          <p className="muted nameorigin__note">
            DAT stands for Deghne, Alex and Theodore, the three of us behind the shelf.
          </p>
        </section>

        <section className="story">
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>
              <h2 className="section-title" data-reveal>Why we started</h2>
              <p className="story__lede" data-reveal>
                It started with a group chat and too many samples.
              </p>
              <p className="story__body" data-reveal>
                We kept swapping decants, arguing over drydowns and sending each other photos of nothing but bottles.
                Every shop we tried either buried the notes under marketing or treated fragrance like an afterthought.
                So we built the shop we wanted: one that puts the pyramid first, keeps the shelf small, and talks about
                scent the way people who love it actually do. DAT Fragrances is that idea, made small enough to
                keep honest.
              </p>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  )
}
