// Hypothetical store: prices (PHP) and descriptions are written for this class project
// and are not official brand claims. Bottle art is a placeholder illustration.
import { extras } from './moreProducts'

const CATEGORY = {
  'creed-aventus': 'Niche',
  'mfk-baccarat-rouge-540': 'Niche',
  'pdm-layton': 'Niche',
  'byredo-gypsy-water': 'Niche',
  'le-labo-santal-33': 'Niche',
  'dior-sauvage-elixir': 'Designer',
  'tom-ford-oud-wood': 'Designer',
  'chanel-bleu-de-chanel': 'Designer',
}

const base = [
  {
    slug: 'creed-aventus',
    image: '/images/aventus.png',
    name: 'Aventus',
    house: 'Creed',
    family: 'Fruity Chypre',
    price: 18500,
    tint: '#a9b27c',
    shape: 'tall',
    tagline: 'Smoke, fruit and birch. The modern benchmark.',
    description:
      'A bright pineapple opening dries down into smoked birch and a mossy, musky base. Confident without shouting, it is the bottle most fragrance heads measure everything else against.',
    notes: {
      top: ['Pineapple', 'Bergamot', 'Blackcurrant'],
      heart: ['Birch', 'Patchouli', 'Jasmine'],
      base: ['Musk', 'Oakmoss', 'Ambergris'],
    },
    sizes: [{ ml: 50, price: 18500 }, { ml: 100, price: 26500 }],
  },
  {
    slug: 'mfk-baccarat-rouge-540',
    image: '/images/baccarat-rouge-540.png',
    name: 'Baccarat Rouge 540',
    house: 'Maison Francis Kurkdjian',
    family: 'Amber Floral',
    price: 21500,
    tint: '#d98a6a',
    shape: 'block',
    tagline: 'Saffron light over burnt sugar and cedar.',
    description:
      'Airy and luminous, with a mineral, sugary glow that lingers on skin and clothes. A modern classic that people stop you to ask about.',
    notes: {
      top: ['Saffron', 'Jasmine'],
      heart: ['Amberwood', 'Ambergris'],
      base: ['Fir Resin', 'Cedar'],
    },
    sizes: [{ ml: 70, price: 21500 }, { ml: 200, price: 36500 }],
  },
  {
    slug: 'dior-sauvage-elixir',
    image: '/images/sauvage-elixir.png',
    name: 'Sauvage Elixir',
    house: 'Dior',
    family: 'Spicy Lavender',
    price: 9800,
    tint: '#9a5a36',
    shape: 'flask',
    tagline: 'Spice and licorice, dense and warm.',
    description:
      'A concentrated take on a household name: cinnamon and cardamom over lavender, settling into a deep licorice and sandalwood trail built for cold evenings.',
    notes: {
      top: ['Grapefruit', 'Cinnamon', 'Cardamom'],
      heart: ['Lavender'],
      base: ['Licorice', 'Sandalwood', 'Amber', 'Vetiver'],
    },
    sizes: [{ ml: 60, price: 9800 }, { ml: 100, price: 13500 }],
  },
  {
    slug: 'tom-ford-oud-wood',
    image: '/images/oud-wood.png',
    name: 'Oud Wood',
    house: 'Tom Ford',
    family: 'Woody Oriental',
    price: 17800,
    tint: '#7d5a45',
    shape: 'block',
    tagline: 'Smooth oud, rosewood and quiet spice.',
    description:
      'Oud without the harshness. Rosewood and cardamom open onto a polished, resinous heart, finishing on tonka and amber. Refined, cozy and easy to wear.',
    notes: {
      top: ['Rosewood', 'Cardamom', 'Chinese Pepper'],
      heart: ['Oud', 'Sandalwood', 'Vetiver'],
      base: ['Tonka Bean', 'Amber'],
    },
    sizes: [{ ml: 50, price: 17800 }, { ml: 100, price: 24800 }],
  },
  {
    slug: 'chanel-bleu-de-chanel',
    image: '/images/bleu-de-chanel.png',
    name: 'Bleu de Chanel',
    house: 'Chanel',
    family: 'Woody Aromatic',
    price: 8900,
    tint: '#4f7aa8',
    shape: 'flask',
    tagline: 'Clean citrus over cedar and incense.',
    description:
      'Crisp grapefruit and mint soften into a dry, incense-laced cedar. A reliable signature for the office, the weekend, or anywhere in between.',
    notes: {
      top: ['Grapefruit', 'Lemon', 'Mint'],
      heart: ['Ginger', 'Nutmeg', 'Jasmine'],
      base: ['Incense', 'Cedar', 'Sandalwood'],
    },
    sizes: [{ ml: 50, price: 8900 }, { ml: 100, price: 12400 }],
  },
  {
    slug: 'pdm-layton',
    image: '/images/layton.png',
    name: 'Layton',
    house: 'Parfums de Marly',
    family: 'Vanilla Spicy',
    price: 15800,
    tint: '#b86a78',
    shape: 'round',
    tagline: 'Apple, vanilla and a long woody tail.',
    description:
      'Fresh apple and lavender give way to a creamy vanilla and cardamom core. Bold projection and all-day wear make it a cold-weather favorite.',
    notes: {
      top: ['Apple', 'Lavender', 'Bergamot', 'Mandarin'],
      heart: ['Geranium', 'Violet', 'Jasmine'],
      base: ['Vanilla', 'Cardamom', 'Sandalwood', 'Patchouli'],
    },
    sizes: [{ ml: 75, price: 15800 }, { ml: 125, price: 20800 }],
  },
  {
    slug: 'byredo-gypsy-water',
    image: '/images/gypsy-water.png',
    name: 'Gypsy Water',
    house: 'Byredo',
    family: 'Woody Aromatic',
    price: 16200,
    tint: '#8fa58e',
    shape: 'tall',
    tagline: 'Pine, incense and vanilla by a campfire.',
    description:
      'A soft, resinous wander through pine needles and juniper, warmed by vanilla and sandalwood. Quiet, bohemian and unmistakably Byredo.',
    notes: {
      top: ['Bergamot', 'Lemon', 'Pepper', 'Juniper'],
      heart: ['Incense', 'Pine Needle', 'Orris'],
      base: ['Amber', 'Vanilla', 'Sandalwood'],
    },
    sizes: [{ ml: 50, price: 16200 }, { ml: 100, price: 21800 }],
  },
  {
    slug: 'le-labo-santal-33',
    image: '/images/santal-33.png',
    name: 'Santal 33',
    house: 'Le Labo',
    family: 'Woody Leather',
    price: 19800,
    tint: '#b79b6f',
    shape: 'round',
    tagline: 'Sandalwood, papyrus and a leathery drift.',
    description:
      'Dry, smoky sandalwood with cedar and papyrus over a leathery musk. A cult favorite with a distinctive, lived-in character.',
    notes: {
      top: ['Cardamom', 'Iris', 'Violet'],
      heart: ['Ambrox', 'Cedar', 'Papyrus'],
      base: ['Sandalwood', 'Leather', 'Musk'],
    },
    sizes: [{ ml: 50, price: 19800 }, { ml: 100, price: 28800 }],
  },
]

export const products = [...base.map((p) => ({ ...p, category: CATEGORY[p.slug] })), ...extras]

export const featured = ['creed-aventus', 'mfk-baccarat-rouge-540', 'le-labo-santal-33']

export const bySlug = (slug) => products.find((p) => p.slug === slug)

export const peso = (n) => '₱' + n.toLocaleString('en-PH')
