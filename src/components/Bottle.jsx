import { useId } from 'react'

// Placeholder bottle illustration, tinted per product.
const BODIES = {
  block: { d: 'M52 112 h96 a8 8 0 0 1 8 8 v142 a8 8 0 0 1 -8 8 h-96 a8 8 0 0 1 -8 -8 v-142 a8 8 0 0 1 8 -8 z', top: 112, bottom: 270 },
  tall: { d: 'M64 104 h72 a8 8 0 0 1 8 8 v152 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-152 a8 8 0 0 1 8 -8 z', top: 104, bottom: 272 },
  round: { d: 'M100 128 a74 74 0 1 0 0.01 0 z', top: 128, bottom: 276 },
  flask: { d: 'M72 110 h56 q26 4 30 30 v112 a18 18 0 0 1 -18 18 h-80 a18 18 0 0 1 -18 -18 v-112 q4 -26 30 -30 z', top: 110, bottom: 270 },
}

export default function Bottle({ shape = 'block', tint = '#d4b97e', className = '', title }) {
  const uid = useId().replace(/:/g, '')
  const body = BODIES[shape] || BODIES.block
  const level = body.top + (body.bottom - body.top) * 0.28
  return (
    <svg
      className={`bottle ${className}`}
      viewBox="0 0 200 300"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <path d={body.d} />
        </clipPath>
        <linearGradient id={`glass-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#f4ead8" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#f4ead8" stopOpacity="0.03" />
          <stop offset="1" stopColor="#f4ead8" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`liquid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.92" />
          <stop offset="1" stopColor={tint} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a7243" />
          <stop offset="0.45" stopColor="#ecd5a0" />
          <stop offset="1" stopColor="#7a6439" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="286" rx="70" ry="6" fill="#000" opacity="0.45" />

      <g clipPath={`url(#clip-${uid})`}>
        <rect x="0" y={level} width="200" height="300" fill={`url(#liquid-${uid})`} />
        <rect x="0" y={level} width="200" height="1.5" fill="#fff" opacity="0.35" />
      </g>
      <path d={body.d} fill={`url(#glass-${uid})`} stroke="#eee4d3" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M70 128 v110" stroke="#fff" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" clipPath={`url(#clip-${uid})`} />

      <rect x="88" y="92" width="24" height="22" fill="#eee4d3" fillOpacity="0.14" stroke="#eee4d3" strokeOpacity="0.3" />
      <rect x="76" y="42" width="48" height="52" rx="3" fill={`url(#cap-${uid})`} />
      <rect x="76" y="42" width="48" height="3" fill="#fff" opacity="0.25" />
    </svg>
  )
}
