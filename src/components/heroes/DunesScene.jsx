import { useId } from 'react'
import Motes from '../Motes'

// Dusk landscape in the site's gold: pure SVG, no photo. Used as a billboard slide background.
export default function DunesScene() {
  const uid = useId().replace(/:/g, '')
  const id = (n) => `${uid}${n}`
  const ref = (n) => `url(#${uid}${n})`

  return (
    <div className="hx__scene" aria-hidden="true">
      <svg className="hx__svg" viewBox="0 300 1440 560" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <linearGradient id={id('Sky')} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="640">
            <stop offset="0" stopColor="#060608" />
            <stop offset="0.38" stopColor="#0e0a07" />
            <stop offset="0.6" stopColor="#2a1d0d" />
            <stop offset="0.8" stopColor="#7a5a28" />
            <stop offset="0.93" stopColor="#c9a05a" />
            <stop offset="1" stopColor="#e3c27c" />
          </linearGradient>
          <radialGradient id={id('Sun')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="35%" stopColor="#f1dba6" />
            <stop offset="100%" stopColor="#d4b97e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('Glow')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ecd5a0" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#d4b97e" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#d4b97e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('Far')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a6a32" />
            <stop offset="100%" stopColor="#2a1d0c" />
          </linearGradient>
          <linearGradient id={id('Mid1')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d3919" />
            <stop offset="100%" stopColor="#17110a" />
          </linearGradient>
          <linearGradient id={id('Mid2')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1e0f" />
            <stop offset="100%" stopColor="#0d0a06" />
          </linearGradient>
        </defs>

        <rect x="-40" y="0" width="1520" height="920" fill={ref('Sky')} />

        {/* two sun positions: right of centre on wide screens, centred on narrow ones */}
        <g className="hx__sun hx__sun--wide">
          <circle cx="1050" cy="500" r="430" fill={ref('Glow')} />
          <circle cx="1050" cy="506" r="74" fill={ref('Sun')} />
        </g>
        <g className="hx__sun hx__sun--narrow">
          <circle cx="800" cy="500" r="430" fill={ref('Glow')} />
          <circle cx="800" cy="506" r="74" fill={ref('Sun')} />
        </g>

        <g className="hx__ridge hx__ridge--far">
          <path d="M-40,572 C150,528 320,560 520,532 C720,504 860,552 1040,522 C1200,496 1320,532 1480,512 L1480,920 L-40,920 Z" fill={ref('Far')} />
          <path d="M-40,572 C150,528 320,560 520,532 C720,504 860,552 1040,522 C1200,496 1320,532 1480,512" fill="none" stroke="rgba(241,219,166,0.5)" strokeWidth="1.4" />
        </g>
        <g className="hx__ridge hx__ridge--mid1">
          <path d="M-40,652 C120,612 290,620 450,636 C640,655 760,596 940,602 C1120,608 1270,652 1480,620 L1480,920 L-40,920 Z" fill={ref('Mid1')} />
          <path d="M-40,652 C120,612 290,620 450,636 C640,655 760,596 940,602 C1120,608 1270,652 1480,620" fill="none" stroke="rgba(236,213,160,0.28)" strokeWidth="1.2" />
        </g>
        <g className="hx__ridge hx__ridge--mid2">
          <path d="M-40,736 C200,694 360,736 560,720 C760,704 900,662 1100,684 C1260,700 1360,736 1480,714 L1480,920 L-40,920 Z" fill={ref('Mid2')} />
          <path d="M-40,736 C200,694 360,736 560,720 C760,704 900,662 1100,684 C1260,700 1360,736 1480,714" fill="none" stroke="rgba(212,185,126,0.16)" strokeWidth="1" />
        </g>
        <g className="hx__ridge hx__ridge--near">
          <path d="M-40,820 C220,786 420,818 640,802 C860,786 1040,756 1240,778 C1340,789 1420,806 1480,800 L1480,920 L-40,920 Z" fill="#0a0a0a" />
        </g>
      </svg>
      <Motes count={44} />
    </div>
  )
}
