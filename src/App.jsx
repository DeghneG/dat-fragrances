import { useLayoutEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import SiteNav from './components/SiteNav'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import NotFound from './pages/NotFound'
import { CartProvider } from './context/CartContext'

// Every link click or page change starts at the top. The jump is instant (the page has smooth scrolling on,
// and a long animated scroll gets cut short when the new page changes height). Filter, sort and search edits
// use "replace" navigation, so they do not yank the page back to the top.
function ScrollToTop() {
  const { pathname, search } = useLocation()
  const navType = useNavigationType()
  useLayoutEffect(() => {
    if (navType === 'REPLACE') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search, navType])
  return null
}

// Each page fades in on navigation (the key is the path, so filter changes don't replay it).
function AnimatedRoutes() {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="route-fade">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <AnimatedRoutes />
      </main>
      <SiteFooter />
      </CartProvider>
    </BrowserRouter>
  )
}
