import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { bySlug } from '../data/products'

const KEY = 'dat-cart-v1'
export const MAX_QTY = 10

const CartCtx = createContext(null)

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!Array.isArray(v)) return []
    return v.filter((i) => i && typeof i.slug === 'string' && Number.isFinite(i.ml) && Number.isInteger(i.qty) && i.qty > 0)
  } catch {
    return []
  }
}

// The cart keeps only what was chosen (slug, size, quantity). Names and prices are looked up from the catalog,
// so a price change or a removed product can never leave a stale line behind.
export function CartProvider({ children }) {
  const [items, setItems] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // private mode or blocked storage: the cart still works for this visit
    }
  }, [items])

  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setItems(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((slug, ml, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.slug === slug && x.ml === ml)
      if (i === -1) return [...prev, { slug, ml, qty: Math.min(qty, MAX_QTY) }]
      const next = [...prev]
      next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, MAX_QTY) }
      return next
    })
  }, [])

  const setQty = useCallback((slug, ml, qty) => {
    setItems((prev) => prev.map((x) => (x.slug === slug && x.ml === ml ? { ...x, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : x)))
  }, [])

  const remove = useCallback((slug, ml) => {
    setItems((prev) => prev.filter((x) => !(x.slug === slug && x.ml === ml)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const lines = items
      .map((it) => {
        const product = bySlug(it.slug)
        const size = product?.sizes.find((s) => s.ml === it.ml)
        if (!product || !size) return null
        return { ...it, product, unit: size.price, total: size.price * it.qty }
      })
      .filter(Boolean)
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      add,
      setQty,
      remove,
      clear,
    }
  }, [items, add, setQty, remove, clear])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
