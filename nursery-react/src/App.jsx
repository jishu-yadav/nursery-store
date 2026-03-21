import { useEffect, useMemo, useRef, useState } from 'react'

const ownerName = 'Nursery Store'
const ownerPhone = atob('OTkyOTAxNjQzNg==') 
const ownerEmail = 'shop@example.com'

const STORAGE_KEYS = {
  products: 'nursery_products',
  cart: 'nursery_cart',
  adminCode: 'nursery_admin_code',
  adminSession: 'nursery_admin_session',
}

const defaultProducts = [
  {
    id: 1,
    name: 'Snake Plant',
    category: 'Indoor',
    price: 599,
    featured: true,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&q=60',
    description: 'Low maintenance, air-purifying, and ideal for beginners.',
    sunlight: 'Low to medium',
    watering: 'Every 10-15 days',
    care: 'Easy',
    sku: 'IND-001',
  },
  {
    id: 2,
    name: 'Money Plant',
    category: 'Indoor',
    price: 299,
    featured: true,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=900&q=60',
    description: 'Fast-growing indoor climber for shelves and balconies.',
    sunlight: 'Indirect light',
    watering: 'Twice a week',
    care: 'Easy',
    sku: 'IND-002',
  },
  {
    id: 3,
    name: 'Fiddle Leaf Fig',
    category: 'Indoor',
    price: 1299,
    featured: true,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=60',
    description: 'Popular indoor plant with large glossy leaves.',
    sunlight: 'Bright indirect light',
    watering: 'Weekly',
    care: 'Medium',
    sku: 'IND-003',
  },
  {
    id: 4,
    name: 'Rose Bush',
    category: 'Outdoor',
    price: 499,
    featured: true,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1698106471611-a66870afe1be?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Great for garden beds and flowering borders.',
    sunlight: 'Full sun',
    watering: '2-3 times weekly',
    care: 'Medium',
    sku: 'OUT-001',
  },
  {
    id: 5,
    name: 'Basil Plant',
    category: 'Herbs',
    price: 149,
    featured: true,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=900&q=60',
    description: 'Fresh kitchen herb for cooking and garnish.',
    sunlight: 'Bright light',
    watering: 'Keep soil slightly moist',
    care: 'Easy',
    sku: 'HERB-001',
  },
  {
    id: 6,
    name: 'Areca Palm',
    category: 'Indoor',
    price: 899,
    featured: false,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=900&q=60',
    description: 'A graceful palm that brightens living rooms and corners.',
    sunlight: 'Bright indirect light',
    watering: 'Weekly',
    care: 'Medium',
    sku: 'IND-004',
  },
]

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const waLink = (text) =>
  `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`

function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function normalizeProduct(raw, fallbackId = null) {
  return {
    id: Number(raw.id) || fallbackId || Date.now(),
    name: String(raw.name || '').trim(),
    category: String(raw.category || 'Indoor').trim(),
    price: Number(raw.price) || 0,
    featured: raw.featured === true || raw.featured === 'true',
    stock: Number(raw.stock) || 0,
    image:
      String(raw.image || '').trim() ||
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=60',
    description: String(raw.description || '').trim(),
    sunlight: String(raw.sunlight || 'Not specified').trim(),
    watering: String(raw.watering || 'Not specified').trim(),
    care: String(raw.care || 'Not specified').trim(),
    sku: String(raw.sku || `SKU-${fallbackId || Date.now()}`).trim(),
  }
}

function loadProducts() {
  const stored = safeJSONParse(localStorage.getItem(STORAGE_KEYS.products), null)
  if (Array.isArray(stored) && stored.length) {
    return stored.map((p, idx) => normalizeProduct(p, idx + 1))
  }
  return defaultProducts
}

function loadCart() {
  const stored = safeJSONParse(localStorage.getItem(STORAGE_KEYS.cart), {})
  return stored && typeof stored === 'object' ? stored : {}
}

function createEmptyDraft() {
  return {
    name: '',
    category: 'Indoor',
    price: '',
    featured: true,
    stock: '',
    image: '',
    description: '',
    sunlight: '',
    watering: '',
    care: 'Easy',
    sku: '',
  }
}

function ProductCard({ product, onView, onAdd, onContact }) {
  return (
    <article className="product-card">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="product-body">
        <div className="product-top">
          <div>
            <h4 className="product-title">{product.name}</h4>
            <p className="product-category">{product.category}</p>
          </div>
          <div className="product-right">
            <div className="product-price">{money(product.price)}</div>
            <div className="stock">{product.stock} in stock</div>
          </div>
        </div>

        <p className="product-desc">{product.description}</p>

        <div className="card-actions">
          <button className="btn btn-secondary" onClick={() => onView(product)}>
            View
          </button>
          <button className="btn btn-primary" onClick={() => onAdd(product)}>
            Add
          </button>
        </div>

        <button className="btn btn-outline full" onClick={() => onContact(product)}>
          Contact for this plant
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const [products, setProducts] = useState(() => loadProducts())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState(() => loadCart())
  const [activeProduct, setActiveProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  const [adminOpen, setAdminOpen] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEYS.adminSession) === 'true',
  )
  const [adminPass, setAdminPass] = useState('')
  const [adminError, setAdminError] = useState('')
  const [draft, setDraft] = useState(createEmptyDraft())
  const [editingId, setEditingId] = useState(null)

  const importInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.products) {
        setProducts(loadProducts())
      }
      if (e.key === STORAGE_KEYS.cart) {
        setCart(loadCart())
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products],
  )

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)

      return matchesCategory && matchesText
    })
  }, [products, search, category])

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === Number(id))
        return product ? { ...product, qty } : null
      })
      .filter(Boolean)
  }, [cart, products])

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  )

  function addToCart(product) {
    setCart((prev) => {
      const current = prev[product.id] || 0
      if (current >= product.stock) {
        alert('Not enough stock.')
        return prev
      }
      return { ...prev, [product.id]: current + 1 }
    })
    setCartOpen(true)
  }

  function changeQty(id, qty) {
    setCart((prev) => {
      const product = products.find((p) => p.id === Number(id))
      if (!product) return prev

      if (qty <= 0) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }

      if (qty > product.stock) {
        alert('Not enough stock.')
        return prev
      }

      return { ...prev, [id]: qty }
    })
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  function askAboutProduct(product) {
    window.open(
      waLink(
        `Hello ${ownerName}, I want to ask about ${product.name}. Is it available?`,
      ),
      '_blank',
    )
  }

  function sendCartOnWhatsApp() {
    if (!cartItems.length) {
      alert('Cart is empty.')
      return
    }

    const lines = cartItems.map(
      (item) => `- ${item.name} x ${item.qty} (${money(item.price)})`,
    )

    const msg = `Hello ${ownerName}, I want to order:\n${lines.join(
      '\n',
    )}\n\nTotal: ${money(cartTotal)}\nPlease confirm availability and pickup/delivery.`

    window.open(waLink(msg), '_blank')
  }

  function submitContact(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name')
    const phone = form.get('phone')
    const message = form.get('message')

    window.open(
      waLink(
        `Hello ${ownerName}, my name is ${name}. Phone: ${phone}. Message: ${message}`,
      ),
      '_blank',
    )

    e.currentTarget.reset()
  }

  function openAdmin() {
    setAdminOpen(true)
    setAdminError('')
    setAdminPass('')
  }

  function closeAdmin() {
    setAdminOpen(false)
    setAdminError('')
    setAdminPass('')
  }

  function handleAdminLogin(e) {
    e.preventDefault()

    const savedCode = localStorage.getItem(STORAGE_KEYS.adminCode)

    if (!savedCode && adminPass === 'owner-pass') {
      localStorage.setItem(STORAGE_KEYS.adminCode, 'owner-pass')
      localStorage.setItem(STORAGE_KEYS.adminSession, 'true')
      setAdminUnlocked(true)
      setAdminError('')
      return
    }

    if (savedCode && adminPass === savedCode) {
      localStorage.setItem(STORAGE_KEYS.adminSession, 'true')
      setAdminUnlocked(true)
      setAdminError('')
      return
    }

    setAdminError('Wrong passcode. Try owner-pass')
  }

  function logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.adminSession)
    setAdminUnlocked(false)
    setAdminError('')
    setAdminPass('')
  }

  function startNewProduct() {
    setDraft(createEmptyDraft())
    setEditingId(null)
  }

  function editProduct(product) {
    setAdminOpen(true)
    setAdminUnlocked(true)
    setEditingId(product.id)
    setDraft({
      name: product.name || '',
      category: product.category || 'Indoor',
      price: String(product.price ?? ''),
      featured: !!product.featured,
      stock: String(product.stock ?? ''),
      image: product.image || '',
      description: product.description || '',
      sunlight: product.sunlight || '',
      watering: product.watering || '',
      care: product.care || 'Easy',
      sku: product.sku || '',
    })
  }

  function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(id)))
    if (editingId === id) startNewProduct()
  }

  function resetSampleProducts() {
    if (!confirm('Reset all products back to the sample plant list?')) return
    setProducts(defaultProducts)
    startNewProduct()
  }

  function exportProducts() {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nursery-products.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importProductsFromFile(file) {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)

      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of products.')
        return
      }

      const cleaned = parsed.map((item, idx) => normalizeProduct(item, idx + 1))
      setProducts(cleaned)
      startNewProduct()
      alert('Products imported.')
    } catch {
      alert('Could not import JSON.')
    }
  }

  function saveDraft(e) {
    e.preventDefault()

    if (!draft.name.trim()) {
      alert('Product name is required.')
      return
    }

    const product = normalizeProduct(
      {
        ...draft,
        id: editingId || Date.now(),
        featured: !!draft.featured,
      },
      editingId || Date.now(),
    )

    setProducts((prev) => {
      const remaining = prev.filter((p) => Number(p.id) !== Number(product.id))
      return [product, ...remaining]
    })

    setEditingId(null)
    setDraft(createEmptyDraft())
    alert('Product saved.')
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">🌿</div>
          <div>
            <h1>Nursery Store</h1>
            <p>Plants, pots, soil, tools, and care advice</p>
          </div>
        </div>

        <div className="top-actions">
          <a className="btn btn-secondary" href="#contact">
            Contact
          </a>
          <button className="btn btn-secondary" onClick={openAdmin}>
            Admin
          </button>
          <button className="btn btn-primary" onClick={() => setCartOpen(true)}>
            Cart ({cartCount})
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <span className="tag">
              Buy online • Ask on WhatsApp • Pickup in store
            </span>
            <h2>
              Find the right plant for every home, balcony, and garden.
            </h2>
            <p>
              Browse indoor plants, outdoor plants, herbs, and garden essentials.
              If you have questions, contact the owner directly from the site.
            </p>

            <div className="hero-buttons">
              <a className="btn btn-primary" href="#products">
                Shop now
              </a>
              <a
                className="btn btn-secondary"
                href={waLink(
                  `Hello ${ownerName}, I visited your nursery website and want to ask about plants.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a className="btn btn-secondary" href="#contact">
                Ask owner
              </a>
            </div>

            <div className="stat-grid">
              <div className="stat-card">
                <strong>Fast help</strong>
                <span>Message the owner directly</span>
              </div>
              <div className="stat-card">
                <strong>Pickup</strong>
                <span>Reserve and collect in store</span>
              </div>
              <div className="stat-card">
                <strong>Care advice</strong>
                <span>Sunlight, watering, and more</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=60"
              alt="Nursery plants"
            />
          </div>
        </section>

        <section className="pill-row">
          {categories.map((item) => (
            <button
              key={item}
              className={`pill ${category === item ? 'pill-active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <section className="toolbar">
          <div>
            <h3>Search products</h3>
            <p>Search by plant name, category, or care need.</p>
          </div>

          <div className="search-wrap">
            <input
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plants..."
            />
            <button className="btn btn-secondary" onClick={() => setSearch('')}>
              Clear
            </button>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h3>Featured picks</h3>
              <p>Popular items and easy care plants.</p>
            </div>
          </div>

          <div className="grid featured-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setActiveProduct}
                onAdd={addToCart}
                onContact={askAboutProduct}
              />
            ))}
          </div>
        </section>

        <section id="products" className="section">
          <div className="section-head">
            <div>
              <h3>All products</h3>
              <p>Tap a product to view details or contact the owner.</p>
            </div>
          </div>

          <div className="grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setActiveProduct}
                onAdd={addToCart}
                onContact={askAboutProduct}
              />
            ))}
          </div>

          {!filtered.length && <p className="muted">No products found.</p>}
        </section>

        <section className="bottom-grid">
          <div className="info-card">
            <h3>Why customers will use this store</h3>
            <ul>
              <li>Search quickly for the right plant</li>
              <li>Contact owner instantly on WhatsApp</li>
              <li>Check stock before visiting the shop</li>
              <li>View plant care details before buying</li>
            </ul>
          </div>

          <div id="contact" className="info-card">
            <h3>Contact the owner</h3>
            <p>
              For availability, bulk orders, landscaping help, or pickup
              questions, send a message below.
            </p>

            <form className="contact-form" onSubmit={submitContact}>
              <input name="name" placeholder="Your name" required />
              <input name="phone" placeholder="Phone number" required />
              <textarea
                name="message"
                rows="4"
                placeholder="What do you need?"
                required
              />
              <button className="btn btn-primary full" type="submit">
                Send enquiry
              </button>
            </form>

            <div className="muted small">Store hours: Mon-Sat 9:00 AM - 6:00 PM</div>
            <div className="muted small">Email: {ownerEmail}</div>
          </div>
        </section>
      </main>

      <a
        className="floating-whatsapp"
        href={waLink(`Hello ${ownerName}, I want to ask about your plants.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WhatsApp
      </a>

      {activeProduct && (
        <div className="overlay" onClick={() => setActiveProduct(null)}>
          <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
            <div className="modal-header">
              <div>
                <h3>{activeProduct.name}</h3>
                <p>{activeProduct.category}</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveProduct(null)}>
                Close
              </button>
            </div>

            <div className="modal-grid">
              <img src={activeProduct.image} alt={activeProduct.name} />
              <div className="modal-body">
                <div className="modal-price">{money(activeProduct.price)}</div>
                <p>{activeProduct.description}</p>

                <div className="detail-grid">
                  <div className="detail-card">
                    <span>Sunlight</span>
                    <strong>{activeProduct.sunlight}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Watering</span>
                    <strong>{activeProduct.watering}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Stock</span>
                    <strong>{activeProduct.stock} available</strong>
                  </div>
                  <div className="detail-card">
                    <span>Care level</span>
                    <strong>{activeProduct.care}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(activeProduct)
                      setActiveProduct(null)
                    }}
                  >
                    Add to cart
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => askAboutProduct(activeProduct)}
                  >
                    Ask on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <aside className="drawer">
          <div className="drawer-header">
            <div>
              <h3>Your cart</h3>
              <p>Save product ideas and place enquiry later.</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setCartOpen(false)}>
              Close
            </button>
          </div>

          <div className="drawer-items">
            {cartItems.length ? (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-body">
                    <div className="cart-item-top">
                      <strong>{item.name}</strong>
                      <button
                        className="remove-link"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="muted small">{money(item.price)} each</div>

                    <div className="qty-row">
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.qty}
                        onChange={(e) =>
                          changeQty(item.id, Number(e.target.value) || 0)
                        }
                      />
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="muted">Your cart is empty.</div>
            )}
          </div>

          <div className="drawer-footer">
            <div className="total-row">
              <span>Total</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <button className="btn btn-primary full" onClick={sendCartOnWhatsApp}>
              Send cart on WhatsApp
            </button>
            <button className="btn btn-secondary full" onClick={() => setCart({})}>
              Clear cart
            </button>
          </div>
        </aside>
      )}

      {adminOpen && (
        <div className="overlay" onClick={closeAdmin}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Admin</h3>
                <p>Manage products for the nursery store</p>
              </div>
              <div className="modal-actions">
                {adminUnlocked && (
                  <button className="btn btn-secondary" onClick={logoutAdmin}>
                    Logout
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeAdmin}>
                  Close
                </button>
              </div>
            </div>

            {!adminUnlocked ? (
              <div style={{ padding: '18px' }}>
                <form onSubmit={handleAdminLogin} className="contact-form">
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Passcode"
                    required
                  />
                  {adminError && (
                    <div style={{ color: 'crimson', fontSize: '14px' }}>
                      {adminError}
                    </div>
                  )}
                  <button className="btn btn-primary full" type="submit">
                    Login
                  </button>
                  <div className="muted small">Default passcode: owner-pass</div>
                </form>
              </div>
            ) : (
              <div style={{ padding: '18px', display: 'grid', gap: '18px' }}>
                <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  <div className="detail-card">
                    <span>Total products</span>
                    <strong>{products.length}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Featured</span>
                    <strong>{products.filter((p) => p.featured).length}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Low stock</span>
                    <strong>{products.filter((p) => p.stock <= 5).length}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={startNewProduct}>
                    New product
                  </button>
                  <button className="btn btn-secondary" onClick={resetSampleProducts}>
                    Reset sample products
                  </button>
                  <button className="btn btn-secondary" onClick={exportProducts}>
                    Export JSON
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => importInputRef.current?.click()}
                  >
                    Import JSON
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) importProductsFromFile(file)
                      e.target.value = ''
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '18px',
                    alignItems: 'start',
                  }}
                >
                  <form
                    onSubmit={saveDraft}
                    className="info-card"
                    style={{ margin: 0, maxHeight: '80vh', overflowY: 'auto' }}
                  >
                    <h3 style={{ marginTop: 0, fontSize: '22px' }}>
                      {editingId ? 'Edit product' : 'Add product'}
                    </h3>
                    <div className="contact-form" style={{ marginTop: '14px' }}>
                      <input
                        value={draft.name}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Product name"
                        required
                      />
                      <input
                        value={draft.category}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, category: e.target.value }))
                        }
                        placeholder="Category"
                        required
                      />
                      <input
                        type="number"
                        value={draft.price}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, price: e.target.value }))
                        }
                        placeholder="Price in INR"
                        required
                      />
                      <input
                        type="number"
                        value={draft.stock}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, stock: e.target.value }))
                        }
                        placeholder="Stock"
                        required
                      />
                      <input
                        value={draft.sku}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, sku: e.target.value }))
                        }
                        placeholder="SKU"
                      />
                      <input
                        value={draft.image}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, image: e.target.value }))
                        }
                        placeholder="Image URL"
                      />
                      <input
                        value={draft.sunlight}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, sunlight: e.target.value }))
                        }
                        placeholder="Sunlight"
                      />
                      <input
                        value={draft.watering}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, watering: e.target.value }))
                        }
                        placeholder="Watering"
                      />
                      <input
                        value={draft.care}
                        onChange={(e) =>
                          setDraft((prev) => ({ ...prev, care: e.target.value }))
                        }
                        placeholder="Care level"
                      />
                      <textarea
                        rows="4"
                        value={draft.description}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                      />
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#475569',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!draft.featured}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                        />
                        Featured product
                      </label>
                      <div className="modal-actions">
                        <button className="btn btn-primary" type="submit">
                          Save product
                        </button>
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={startNewProduct}
                        >
                          Clear form
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="info-card" style={{ margin: 0 }}>
                    <h3 style={{ marginTop: 0, fontSize: '22px' }}>Products</h3>
                    <div
                      style={{
                        display: 'grid',
                        gap: '12px',
                        marginTop: '14px',
                        maxHeight: '620px',
                        overflow: 'auto',
                        paddingRight: '4px',
                      }}
                    >
                      {products.map((product) => (
                        <div
                          key={product.id}
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '18px',
                            padding: '14px',
                            background: '#f8fafc',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '10px',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800 }}>{product.name}</div>
                              <div className="muted small">{product.category}</div>
                              <div className="muted small">
                                {money(product.price)} • {product.stock} stock
                              </div>
                            </div>
                            <div className="modal-actions" style={{ alignItems: 'start' }}>
                              <button
                                className="btn btn-secondary"
                                onClick={() => editProduct(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => deleteProduct(product.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}