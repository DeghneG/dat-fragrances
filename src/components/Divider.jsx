// Minimal, fragrance-themed section separators.
//   notes: a Top / Heart / Base scale, echoing a scent pyramid
//   drop:  a hairline with a single perfume drop
//   ticks: ruler ticks with a gold diamond, like a measuring scale
export default function Divider({ variant = 'drop', className = '' }) {
  if (variant === 'notes') {
    return (
      <div className={`divider divider--notes ${className}`} role="separator" aria-hidden="true">
        <span className="divider__line" data-draw />
        <span className="divider__label">Top</span>
        <span className="divider__line" data-draw />
        <span className="divider__label">Heart</span>
        <span className="divider__line" data-draw />
        <span className="divider__label">Base</span>
        <span className="divider__line" data-draw />
      </div>
    )
  }
  if (variant === 'ticks') {
    return (
      <div className={`divider divider--ticks ${className}`} role="separator" aria-hidden="true">
        <span className="divider__ruler" data-draw />
        <span className="divider__diamond" />
      </div>
    )
  }
  return (
    <div className={`divider divider--drop ${className}`} role="separator" aria-hidden="true">
      <span className="divider__line" data-draw />
      <svg className="divider__drop" viewBox="0 0 20 28" width="14" height="20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 1.5C10 1.5 2.5 11 2.5 17a7.5 7.5 0 0 0 15 0C17.5 11 10 1.5 10 1.5Z" />
        <path d="M6.2 17.5a3.8 3.8 0 0 0 3.8 3.8" strokeLinecap="round" opacity=".6" />
      </svg>
      <span className="divider__line" data-draw />
    </div>
  )
}
