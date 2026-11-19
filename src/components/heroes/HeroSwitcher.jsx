import { useSearchParams } from 'react-router-dom'
import HeroA from './HeroA'
import HeroB from './HeroB'
import HeroC from './HeroC'
import HeroD from './HeroD'

const VARIANTS = {
  a: { label: 'A', name: 'Original', View: HeroA },
  b: { label: 'B', name: 'Poster', View: HeroB },
  c: { label: 'C', name: 'Anatomy', View: HeroC },
  d: { label: 'D', name: 'Arch', View: HeroD },
}

// Preview only: pick a hero with the pill at the bottom (or ?hero=a|b|c|d). Remove once one is chosen.
export default function HeroSwitcher({ product }) {
  const [params, setParams] = useSearchParams()
  const asked = params.get('hero')
  const key = Object.hasOwn(VARIANTS, asked) ? asked : 'a'
  const { View } = VARIANTS[key]

  return (
    <>
      <View key={key} product={product} />
      <nav className="heropicker" aria-label="Hero design preview">
        <span className="heropicker__title">Hero preview</span>
        {Object.entries(VARIANTS).map(([k, v]) => (
          <button
            key={k}
            type="button"
            className={k === key ? 'is-on' : ''}
            aria-pressed={k === key}
            onClick={() => setParams(k === 'a' ? {} : { hero: k }, { replace: true })}
          >
            <b>{v.label}</b>
            <span>{v.name}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
