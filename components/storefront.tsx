'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-NLV1vD6RkAzBACD587Bh8jYDExGFCf.png'

type Product = { id: string; name: string; type: string; category: string; price: number; badge: string; emoji: string; description: string }

export const products: Product[] = [
  { id: 'laptop-acer', name: 'Acer Aspire 7', type: 'LAPTOP', category: 'Computers', price: 42999, badge: 'BEST SELLER', emoji: '▣', description: 'Everyday performance laptop with a sharp display and solid battery life.' },
  { id: 'cellphone-samsung', name: 'Samsung Galaxy A55', type: 'SMARTPHONE', category: 'Mobile Tech', price: 18999, badge: 'NEW', emoji: '▥', description: 'Vivid AMOLED display with a versatile all-round camera system.' },
  { id: 'headset-hyperx', name: 'HyperX Cloud II', type: 'AUDIO', category: 'Smart Devices', price: 3499, badge: 'BEST SELLER', emoji: '◉', description: 'Comfortable memory foam ear cups with clear virtual surround sound.' },
  { id: 'keyboard-razer', name: 'Razer BlackWidow V4', type: 'ACCESSORY', category: 'Gaming Gear', price: 5999, badge: 'PREMIUM', emoji: '⌨', description: 'Hot-swappable mechanical switches with per-key RGB lighting.' },
  { id: 'printer-canon', name: 'Canon PIXMA G2010', type: 'PERIPHERAL', category: 'Computers', price: 6999, badge: 'POPULAR', emoji: '▤', description: 'Refillable ink tank system built for high-volume printing.' },
  { id: 'cables-anker', name: 'Anker PowerLine III', type: 'ACCESSORY', category: 'Mobile Tech', price: 499, badge: 'ESSENTIAL', emoji: '⌁', description: 'Reinforced, tangle-free cable rated for thousands of bends.' },
  { id: 'case-coolermaster', name: 'Cooler Master MasterBox', type: 'COMPONENT', category: 'Gaming Gear', price: 3999, badge: 'POPULAR', emoji: '▥', description: 'Mesh front panel for excellent airflow in custom builds.' },
  { id: 'laptop-dell', name: 'Dell Inspiron 15', type: 'LAPTOP', category: 'Computers', price: 47999, badge: 'NEW', emoji: '▣', description: 'Reliable build quality with a comfortable keyboard for work and study.' },
]

const categories = ['All', 'Gaming Gear', 'Mobile Tech', 'Computers', 'Smart Devices']
const peso = (value: number) => `₱${value.toLocaleString('en-PH')}`

export default function Storefront() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [serviceOpen, setServiceOpen] = useState(false)

  const visible = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.type}`.toLowerCase().includes(query.toLowerCase())), [category, query])
  const cartItems = products.filter((product) => cart[product.id])
  const itemCount = Object.values(cart).reduce((sum, value) => sum + value, 0)
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)
  const add = (id: string) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  const change = (id: string, amount: number) => setCart((current) => { const next = { ...current, [id]: (current[id] || 0) + amount }; if (next[id] <= 0) delete next[id]; return next })

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, items: itemCount, total }) })
    if (response.ok) { const result = await response.json(); setSubmitted(result.orderNumber); setCart({}); setCheckoutOpen(false) }
  }

  return <div className="storefront">
    <header className="store-nav">
      <a href="#home" className="store-brand"><img src={logoUrl} alt="4RMTECH Gadgets Shop" /></a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'store-links open' : 'store-links'}><a href="#home">Home</a><a href="#products">Products <ChevronDown /></a><a href="#categories">Categories <ChevronDown /></a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      <div className="store-actions"><label className="store-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label><button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag /> Cart <b>{itemCount}</b></button></div>
    </header>

    <main>
      <section className="store-hero" id="home"><div className="hero-copy-store"><p className="store-eyebrow">NEXT-GEN TECH. BUILT FOR YOU.</p><h1>POWER UP YOUR<br /><span>TECH EXPERIENCE.</span></h1><p>Discover premium gadgets, gaming gear, accessories and smart devices made for performance, productivity and everyday life.</p><div className="hero-ctas"><a className="gold-button" href="#products">SHOP NOW <ArrowRight /></a><a className="line-button" href="#categories">EXPLORE GEAR</a></div><div className="hero-metrics"><span><strong>100+</strong> Tech Products</span><span><strong>24/7</strong> Online Shopping</span><span><strong>100%</strong> Quality Picks</span></div></div><div className="hero-art"><div className="tech-orbit orbit-one" /><div className="tech-orbit orbit-two" /><div className="hero-card"><small>4RMTECH</small><strong>ULTIMATE<br />GADGETS</strong><span>Performance meets style</span></div></div></section>
      <div className="brand-strip"><span>GAMING</span><i>◆</i><span>SMARTPHONES</span><i>◆</i><span>ACCESSORIES</span><i>◆</i><span>LAPTOPS</span><i>◆</i><span>AUDIO</span></div>
      <section className="store-section" id="products"><div className="section-top"><div><p className="store-eyebrow">FEATURED COLLECTION</p><h2>POPULAR GADGETS</h2></div><button className="filter-link" onClick={() => { setCategory('All'); setQuery('') }}>VIEW ALL <ArrowRight /></button></div><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="catalog-grid">{visible.map((product) => <article className="catalog-card" key={product.id}><span className="product-badge">{product.badge}</span><div className="product-visual">{product.emoji}</div><small>{product.type}</small><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><strong>{peso(product.price)}</strong><button onClick={() => { add(product.id); setCartOpen(true) }}>ADD <Plus /></button></div></article>)}</div></section>
      <section className="store-section category-section" id="categories"><div className="section-top"><div><p className="store-eyebrow">SHOP YOUR STYLE</p><h2>TECH CATEGORIES</h2></div></div><div className="category-grid-store">{categories.slice(1).map((item, index) => <button key={item} onClick={() => { setCategory(item); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}><span>0{index + 1}</span><strong>{item}</strong><small>{item === 'Gaming Gear' ? 'Keyboards, mice, headsets and more' : item === 'Mobile Tech' ? 'Phones, chargers and accessories' : item === 'Computers' ? 'Laptops, components and upgrades' : 'Wearables and connected tech'}</small><b>EXPLORE <ArrowRight /></b></button>)}</div></section>
      <section className="store-section services-section" id="services"><div className="section-top"><div><p className="store-eyebrow">WE&apos;VE GOT YOU COVERED</p><h2>OUR SERVICES</h2></div></div><div className="service-grid-store"><button onClick={() => setServiceOpen(true)}><span>01</span><strong>Device Repair</strong><p>Certified technicians fix screens, batteries and hardware faults.</p></button><button onClick={() => setServiceOpen(true)}><span>02</span><strong>Tech Support</strong><p>Get help troubleshooting devices, software and connectivity.</p></button><button onClick={() => setServiceOpen(true)}><span>03</span><strong>Setup & Installation</strong><p>We configure your new gadgets, gaming rigs and smart devices.</p></button></div></section>
      <section className="about-store" id="about"><div><p className="store-eyebrow">WHO WE ARE</p><h2>TECH THAT MOVES<br />WITH YOU.</h2></div><p>4RMTECH GADGETS SHOP is a modern gadget store focused on practical, stylish and performance-driven technology. From everyday accessories to gaming essentials, our goal is to make great tech easier to discover.</p></section>
    </main>
    <footer className="store-footer" id="contact"><img src={logoUrl} alt="4RMTECH Gadgets Shop" /><p>Your destination for modern gadgets and accessories.</p><div><a href="#products">Products</a><a href="#services">Services</a><a href="#about">About</a><a href="mailto:hello@4rmtech.com">Contact</a></div><small>© 2026 4RMTECH GADGETS SHOP. All rights reserved.</small></footer>

    {cartOpen && <div className="modal-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-panel" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><h2>Your Cart</h2><button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>{cartItems.length === 0 ? <div className="empty-cart"><ShoppingBag /><p>Your cart is empty.</p></div> : <>{cartItems.map((product) => <div className="cart-line" key={product.id}><span className="cart-icon">{product.emoji}</span><div><strong>{product.name}</strong><small>{peso(product.price)}</small><div><button onClick={() => change(product.id, -1)}><Minus /></button><b>{cart[product.id]}</b><button onClick={() => change(product.id, 1)}><Plus /></button></div></div><strong>{peso(product.price * cart[product.id])}</strong></div>)}<div className="cart-total"><span>Total</span><strong>{peso(total)}</strong></div><button className="gold-button full" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>CHECKOUT <ArrowRight /></button></>}</aside></div>}
    {checkoutOpen && <div className="modal-backdrop"><form className="checkout-panel" onSubmit={placeOrder}><div className="modal-heading"><div><p className="store-eyebrow">ALMOST THERE</p><h2>CHECKOUT</h2></div><button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button></div><div className="checkout-fields"><label>Full Name<input name="customer" required placeholder="Juan Dela Cruz" /></label><label>Email<input name="email" required type="email" placeholder="you@example.com" /></label><label>Phone<input name="phone" required placeholder="09XX XXX XXXX" /></label><label>Delivery Address<input name="address" required placeholder="House/Unit, Street, Barangay" /></label><label className="wide">Payment Method<select name="payment"><option>Cash on Delivery</option><option>GCash</option><option>Credit / Debit Card</option></select></label></div><div className="checkout-total"><span>{itemCount} items</span><strong>{peso(total)}</strong></div><button className="gold-button full">PLACE ORDER <Check /></button></form></div>}
    {serviceOpen && <div className="modal-backdrop"><form className="checkout-panel" onSubmit={(event) => { event.preventDefault(); setServiceOpen(false); setSubmitted('Service request received') }}><div className="modal-heading"><div><p className="store-eyebrow">WE&apos;LL TAKE CARE OF IT</p><h2>BOOK A SERVICE</h2></div><button type="button" onClick={() => setServiceOpen(false)} aria-label="Close service form"><X /></button></div><div className="checkout-fields"><label>Name<input required name="name" /></label><label>Phone<input required name="phone" /></label><label className="wide">What do you need help with?<textarea required name="issue" rows={4} /></label></div><button className="gold-button full">SUBMIT REQUEST <ArrowRight /></button></form></div>}
    {submitted && <div className="toast"><Check /> {submitted.startsWith('4RM-') ? `Order ${submitted} placed successfully.` : submitted}</div>}
  </div>
}
