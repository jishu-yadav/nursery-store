const ADMIN_CODE_KEY = 'nursery_admin_code'
const ADMIN_SESSION_KEY = 'nursery_admin_session'
const DEFAULT_PASS = 'owner-pass'

const sampleProducts = [
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

const els = {
  loginCard: document.getElementById('login-card'),
  adminPanel: document.getElementById('admin-panel'),
  adminPass: document.getElementById('admin-pass'),
  loginBtn: document.getElementById('login-btn'),

  statProducts: document.getElementById('stat-products'),
  statFeatured: document.getElementById('stat-featured'),
  statLowStock: document.getElementById('stat-low-stock'),

  form: document.getElementById('product-form'),
  prodId: document.getElementById('prod-id'),
  prodName: document.getElementById('prod-name'),
  prodCategory: document.getElementById('prod-category'),
  prodPrice: document.getElementById('prod-price'),
  prodStock: document.getElementById('prod-stock'),
  prodImage: document.getElementById('prod-image'),
  prodDesc: document.getElementById('prod-desc'),
  prodSun: document.getElementById('prod-sun'),
  prodWater: document.getElementById('prod-water'),
  prodCare: document.getElementById('prod-care'),
  prodSku: document.getElementById('prod-sku'),
  prodFeatured: document.getElementById('prod-featured'),

  newBtn: document.getElementById('new-btn'),
  clearFormBtn: document.getElementById('clear-form-btn'),
  saveSampleBtn: document.getElementById('save-sample-btn'),
  exportJsonBtn: document.getElementById('export-json-btn'),
  importJsonInput: document.getElementById('import-json-input'),

  productsTable: document.getElementById('products-table'),
  ordersList: document.getElementById('orders-list'),
  exportOrdersBtn: document.getElementById('export-orders-btn'),
  clearOrdersBtn: document.getElementById('clear-orders-btn'),
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getProducts() {
  return readJSON('nursery_products', sampleProducts)
}

function setProducts(products) {
  writeJSON('nursery_products', products)
}

function getOrders() {
  return readJSON('nursery_orders', [])
}

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`
}

function isLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

function showAdmin() {
  els.loginCard.classList.add('hidden')
  els.adminPanel.classList.remove('hidden')
  renderAll()
}

function showLogin() {
  els.loginCard.classList.remove('hidden')
  els.adminPanel.classList.add('hidden')
}

els.loginBtn.addEventListener('click', () => {
  const pass = els.adminPass.value.trim()
  const savedCode = localStorage.getItem(ADMIN_CODE_KEY)

  if (!savedCode && pass === DEFAULT_PASS) {
    localStorage.setItem(ADMIN_CODE_KEY, DEFAULT_PASS)
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    showAdmin()
    return
  }

  if (savedCode && pass === savedCode) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    showAdmin()
    return
  }

  alert('Incorrect passcode.')
})

function clearForm() {
  els.prodId.value = ''
  els.form.reset()
  els.prodFeatured.checked = false
}

function nextId(products) {
  return products.length ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1
}

els.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const products = getProducts()
  const id = els.prodId.value ? Number(els.prodId.value) : nextId(products)

  const product = {
    id,
    name: els.prodName.value.trim(),
    category: els.prodCategory.value.trim(),
    price: Number(els.prodPrice.value),
    stock: Number(els.prodStock.value),
    image:
      els.prodImage.value.trim() ||
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=60',
    description: els.prodDesc.value.trim(),
    sunlight: els.prodSun.value.trim() || 'Not specified',
    watering: els.prodWater.value.trim() || 'Not specified',
    care: els.prodCare.value.trim() || 'Not specified',
    sku: els.prodSku.value.trim() || `SKU-${id}`,
    featured: els.prodFeatured.checked,
  }

  const updated = products.filter((p) => Number(p.id) !== id)
  updated.unshift(product)
  setProducts(updated)

  clearForm()
  renderAll()
  alert('Product saved.')
})

els.newBtn.addEventListener('click', clearForm)
els.clearFormBtn.addEventListener('click', clearForm)

els.saveSampleBtn.addEventListener('click', () => {
  if (!confirm('Reset products back to sample products?')) return
  setProducts(sampleProducts)
  clearForm()
  renderAll()
})

els.exportJsonBtn.addEventListener('click', () => {
  const products = getProducts()
  const blob = new Blob([JSON.stringify(products, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nursery-products.json'
  a.click()
  URL.revokeObjectURL(url)
})

els.importJsonInput.addEventListener('change', async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!Array.isArray(parsed)) {
      alert('JSON must be an array of products.')
      return
    }

    setProducts(parsed)
    renderAll()
    alert('Products imported.')
  } catch {
    alert('Could not import JSON.')
  }

  els.importJsonInput.value = ''
})

els.exportOrdersBtn.addEventListener('click', () => {
  const orders = getOrders()
  if (!orders.length) {
    alert('No orders found.')
    return
  }

  const rows = [['order_id', 'created_at', 'name', 'phone', 'items', 'total', 'message']]

  orders.forEach((order) => {
    rows.push([
      order.id,
      order.createdAt,
      order.name || '',
      order.phone || '',
      (order.items || []).map((i) => `${i.name} x ${i.qty}`).join('; '),
      order.total || 0,
      order.message || '',
    ])
  })

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nursery-orders.csv'
  a.click()
  URL.revokeObjectURL(url)
})

els.clearOrdersBtn.addEventListener('click', () => {
  if (!confirm('Clear all orders?')) return
  localStorage.removeItem('nursery_orders')
  renderAll()
})

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  const products = getProducts().filter((p) => Number(p.id) !== Number(id))
  setProducts(products)
  renderAll()
}

function editProduct(id) {
  const product = getProducts().find((p) => Number(p.id) === Number(id))
  if (!product) return

  els.prodId.value = product.id
  els.prodName.value = product.name || ''
  els.prodCategory.value = product.category || ''
  els.prodPrice.value = product.price ?? 0
  els.prodStock.value = product.stock ?? 0
  els.prodImage.value = product.image || ''
  els.prodDesc.value = product.description || ''
  els.prodSun.value = product.sunlight || ''
  els.prodWater.value = product.watering || ''
  els.prodCare.value = product.care || ''
  els.prodSku.value = product.sku || ''
  els.prodFeatured.checked = !!product.featured

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function renderStats(products) {
  els.statProducts.textContent = products.length
  els.statFeatured.textContent = products.filter((p) => p.featured).length
  els.statLowStock.textContent = products.filter((p) => Number(p.stock) <= 5).length
}

function renderProducts(products) {
  els.productsTable.innerHTML =
    products
      .map(
        (product) => `
    <tr class="border-b align-top">
      <td class="py-3 pr-3">
        <div class="font-semibold">${product.name || ''}</div>
        <div class="text-xs text-slate-500">${product.sku || ''}</div>
      </td>
      <td class="py-3 pr-3">${product.category || ''}</td>
      <td class="py-3 pr-3">${formatMoney(product.price || 0)}</td>
      <td class="py-3 pr-3">${product.stock ?? 0}</td>
      <td class="py-3 pr-3">
        ${
          product.featured
            ? '<span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Yes</span>'
            : '<span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">No</span>'
        }
      </td>
      <td class="py-3 pr-3">
        <div class="flex gap-2">
          <button data-edit="${product.id}" class="edit-btn px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50">Edit</button>
          <button data-del="${product.id}" class="del-btn px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  `,
      )
      .join('') ||
    `
    <tr>
      <td colspan="6" class="py-8 text-center text-slate-500">No products yet.</td>
    </tr>
  `

  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => editProduct(btn.dataset.edit))
  })

  document.querySelectorAll('.del-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.del))
  })
}

function renderOrders() {
  const orders = getOrders()

  els.ordersList.innerHTML =
    orders
      .map(
        (order) => `
    <div class="border rounded-2xl p-4 bg-slate-50">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div class="font-semibold">${order.id}</div>
          <div class="text-sm text-slate-500">${new Date(order.createdAt).toLocaleString()}</div>
          <div class="mt-2 text-sm">
            <div><strong>Name:</strong> ${order.name || '-'}</div>
            <div><strong>Phone:</strong> ${order.phone || '-'}</div>
            <div><strong>Message:</strong> ${order.message || '-'}</div>
          </div>
        </div>
        <div class="text-sm md:text-right">
          <div class="font-semibold">${formatMoney(order.total || 0)}</div>
          <div class="text-slate-500">${order.items?.length || 0} item(s)</div>
        </div>
      </div>

      <div class="mt-3 text-sm">
        <strong>Items:</strong>
        <ul class="list-disc pl-5 text-slate-600">
          ${(order.items || []).map((i) => `<li>${i.name} x ${i.qty}</li>`).join('')}
        </ul>
      </div>
    </div>
  `,
      )
      .join('') || `<div class="text-slate-500">No orders yet.</div>`
}

function renderAll() {
  const products = getProducts()
  renderStats(products)
  renderProducts(products)
  renderOrders()
}

if (isLoggedIn()) {
  showAdmin()
} else {
  showLogin()
  renderAll()
}