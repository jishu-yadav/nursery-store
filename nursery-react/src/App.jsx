import { useEffect, useMemo, useState } from 'react'

const ownerName = 'Nursery Store'
const ownerPhone = '919999999999'
const ownerEmail = 'shop@example.com'

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
  },
  {
    id: 4,
    name: 'Rose Bush',
    category: 'Outdoor',
    price: 499,
    featured: true,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&q=60',
    description: 'Great for garden beds and flowering borders.',
    sunlight: 'Full sun',
    watering: '2-3 times weekly',
    care: 'Medium',
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
  },
]

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value)

const waLink = (text) =>
  `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`

function loadProducts() {
  try {
    const saved = localStorage.getItem('nursery_products')
    return saved ? JSON.parse(saved) : defaultProducts
  } catch {
    return defaultProducts
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem('nursery_cart')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
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

  useEffect(() => {
    localStorage.setItem('nursery_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('nursery_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'nursery_products') {
        setProducts(loadProducts())
      }
      if (e.key === 'nursery_cart') {
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
              Browse indoor plants, outdoor plants, herbs, pots, soil, and garden
              tools. If you have questions, contact the owner directly from the site.
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
            <button
              className="btn btn-secondary"
              onClick={() => setSearch('')}
            >
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
        href={waLink(
          `Hello ${ownerName}, I want to ask about your plants.`,
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WhatsApp
      </a>

      {activeProduct && (
        <div className="overlay" onClick={() => setActiveProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{activeProduct.name}</h3>
                <p>{activeProduct.category}</p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveProduct(null)}
              >
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
            <button
              className="btn btn-secondary"
              onClick={() => setCartOpen(false)}
            >
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
    </div>
  )
}