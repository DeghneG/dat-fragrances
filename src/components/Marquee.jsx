// Real house logos, all recoloured to one champagne gold. `h` is the display height in px,
// tuned per mark so wide wordmarks and tall emblems carry the same visual weight.
const LOGOS = [
  { name: 'Lattafa', src: '/logos/lattafa.png', h: 46 },
  { name: 'Creed', src: '/logos/creed.png', h: 44 },
  { name: 'Yves Saint Laurent', src: '/logos/yves-saint-laurent.png', h: 46 },
  { name: 'Amouage', src: '/logos/amouage.png', h: 46 },
  { name: 'Chanel', src: '/logos/chanel.png', h: 19 },
  { name: 'Dior', src: '/logos/dior.png', h: 25 },
  { name: 'Louis Vuitton', src: '/logos/louis-vuitton.png', h: 46 },
  { name: 'Giorgio Armani', src: '/logos/giorgio-armani.png', h: 20 },
  { name: 'Rasasi', src: '/logos/rasasi.png', h: 34 },
  { name: 'French Avenue', src: '/logos/french-avenue.png', h: 36 },
  { name: 'Armaf', src: '/logos/armaf.png', h: 54 },
  { name: 'Afnan', src: '/logos/afnan.png', h: 52 },
  { name: 'Xerjoff', src: '/logos/xerjoff.png', h: 22 },
  { name: 'Initio Parfums Privés', src: '/logos/initio.png', h: 46 },
  { name: 'Argos Fragrances', src: '/logos/argos.png', h: 58 },
  { name: 'Versace', src: '/logos/versace.png', h: 54 },
]

// Slow strip of the houses we carry. Static (and wrapping) for reduced motion.
export default function Marquee() {
  return (
    <div className="marquee" role="presentation" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((n) => (
          <ul key={n} className="marquee__list">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <li key={`${l.name}-${i}`} className={i >= LOGOS.length ? 'is-dup' : undefined}>
                <img src={l.src} alt="" style={{ height: l.h }} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
