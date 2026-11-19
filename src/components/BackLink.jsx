import { Link } from 'react-router-dom'

// Quiet "back" control: a hairline arrow that slides left on hover.
export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="backlink">
      <svg className="backlink__arrow" viewBox="0 0 24 12" width="22" height="11" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M23 6H1.5M6 1 1 6l5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </Link>
  )
}
