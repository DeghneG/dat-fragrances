// Ordering rules for the demo store: shipping, payment modes and where orders are kept.
// Everything here is a class-project simulation. No real payment is taken and nothing leaves the browser.

export const REGIONS = [
  { value: 'visayas', label: 'Visayas', fee: 120 },
  { value: 'luzon', label: 'Luzon', fee: 180 },
  { value: 'mindanao', label: 'Mindanao', fee: 200 },
]

export const FREE_SHIPPING_FROM = 5000 // standard delivery is free from this subtotal

export const SHIPPING = [
  {
    id: 'standard',
    label: 'Standard delivery',
    note: '3 to 5 business days. Free from ₱5,000.',
    days: [3, 5],
    fee: (region, subtotal) => (subtotal >= FREE_SHIPPING_FROM ? 0 : region.fee),
  },
  {
    id: 'express',
    label: 'Express delivery',
    note: '1 to 2 business days, tracked.',
    days: [1, 2],
    fee: (region) => region.fee + 200,
  },
  {
    id: 'pickup',
    label: 'Store pickup',
    note: 'DAT Fragrances Atelier, Leganes, Iloilo. Ready in 24 hours.',
    days: [1, 1],
    fee: () => 0,
  },
]

export const PAYMENTS = [
  { id: 'cod', label: 'Cash on delivery', pickupLabel: 'Pay at the store', blurb: 'Pay the courier in cash when your order arrives. Please prepare the exact amount.', pickupBlurb: 'Pay in cash or by card when you collect your order.' },
  { id: 'gcash', label: 'GCash', blurb: 'Send the total to our GCash number after you place the order. We hold your bottles for 24 hours.' },
  { id: 'maya', label: 'Maya', blurb: 'Send the total to our Maya number after you place the order. We hold your bottles for 24 hours.' },
  { id: 'bank', label: 'Bank transfer', blurb: 'Transfer the total to our bank account after you place the order. Use your order number as the reference.' },
  { id: 'card', label: 'Credit or debit card', blurb: 'Pay now by card. Demo only: use any test number, nothing is charged or saved.' },
]

// Fictional account details, shown on the confirmation page for the non-cash modes.
export const PAY_DETAILS = {
  gcash: { name: 'DAT Fragrances', number: '0900 000 0000' },
  maya: { name: 'DAT Fragrances', number: '0900 000 0001' },
  bank: { name: 'DAT Fragrances Inc.', number: '0000 0000 0000', bank: 'Sample Bank, Iloilo branch' },
}

export const shippingById = (id) => SHIPPING.find((s) => s.id === id) || SHIPPING[0]
export const paymentById = (id) => PAYMENTS.find((p) => p.id === id) || PAYMENTS[0]
export const regionByValue = (v) => REGIONS.find((r) => r.value === v) || REGIONS[0]

// Business days only (Mon to Sat count as shipping days here, Sunday does not).
export function addBusinessDays(from, n) {
  const d = new Date(from)
  let left = n
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) left -= 1
  }
  return d
}

export const formatDay = (d) => new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })

export function makeOrderId() {
  const d = new Date()
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `DAT-${stamp}-${rand}`
}

const KEY = 'dat-orders-v1'

function readAll() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function saveOrder(order) {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...readAll()].slice(0, 20)))
  } catch {
    // storage unavailable: the confirmation page still works from router state
  }
}

export const getOrder = (id) => readAll().find((o) => o.id === id) || null
