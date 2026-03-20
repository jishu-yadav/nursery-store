const ownerName = "Nursery Store";
const ownerPhone = "919999999999"; // change this to real WhatsApp number with country code, no +
const ownerEmail = "shop@example.com";

const products = [
  {
    id: 1,
    name: "Snake Plant",
    category: "Indoor",
    price: 18,
    featured: true,
    stock: 18,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=900&q=60",
    description: "Low maintenance, air-purifying, and ideal for beginners.",
    sunlight: "Low to medium",
    watering: "Every 10-15 days",
    care: "Easy"
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    category: "Indoor",
    price: 29,
    featured: true,
    stock: 8,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=60",
    description: "Popular indoor plant with large glossy leaves.",
    sunlight: "Bright indirect light",
    watering: "Weekly",
    care: "Medium"
  },
  {
    id: 3,
    name: "Rose Bush",
    category: "Outdoor",
    price: 15,
    featured: true,
    stock: 12,
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&q=60",
    description: "Great for garden beds and flowering borders.",
    sunlight: "Full sun",
    watering: "2-3 times weekly",
    care: "Medium"
  },
  {
    id: 4,
    name: "Basil Plant",
    category: "Herbs",
    price: 8,
    featured: true,
    stock: 30,
    image: "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=900&q=60",
    description: "Fresh kitchen herb for cooking and garnish.",
    sunlight: "Bright light",
    watering: "Keep soil slightly moist",
    care: "Easy"
  },
  {
    id: 5,
    name: "Ceramic Pot",
    category: "Accessories",
    price: 12,
    featured: false,
    stock: 20,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=60",
    description: "Decorative planter pot for indoor plants.",
    sunlight: "N/A",
    watering: "N/A",
    care: "Easy"
  },
  {
    id: 6,
    name: "Potting Soil",
    category: "Soil",
    price: 6,
    featured: false,
    stock: 40,
    image: "https://images.unsplash.com/photo-1465430274688-8d24331d7e46?w=900&q=60",
    description: "Well-draining mix for healthy plant roots.",
    sunlight: "N/A",
    watering: "N/A",
    care: "Easy"
  },
  {
    id: 7,
    name: "Money Plant",
    category: "Indoor",
    price: 10,
    featured: false,
    stock: 25,
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=900&q=60",
    description: "Fast growing indoor climber for shelves and balconies.",
    sunlight: "Indirect light",
    watering: "Twice a week",
    care: "Easy"
  },
  {
    id: 8,
    name: "Garden Shovel",
    category: "Tools",
    price: 9,
    featured: false,
    stock: 14,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&q=60",
    description: "Handy tool for planting and soil work.",
    sunlight: "N/A",
    watering: "N/A",
    care: "Easy"
  }
];

const els = {
  search: document.getElementById("search"),
  clearSearch: document.getElementById("clear-search"),
  productsGrid: document.getElementById("products-grid"),
  featuredGrid: document.getElementById("featured-grid"),
  noResults: document.getElementById("no-results"),
  cartBtn: document.getElementById("cart-btn"),
  cartDrawer: document.getElementById("cart-drawer"),
  closeCart: document.getElementById("close-cart"),
  cartItems: document.getElementById("cart-items"),
  cartCount: document.getElementById("cart-count"),
  cartTotal: document.getElementById("cart-total"),
  clearCart: document.getElementById("clear-cart"),
  cartWhatsapp: document.getElementById("cart-whatsapp"),
  contactForm: document.getElementById("contact-form"),
  modal: document.getElementById("product-modal"),
  closeModal: document.getElementById("close-modal"),
  modalTitle: document.getElementById("modal-title"),
  modalCategory: document.getElementById("modal-category"),
  modalImage: document.getElementById("modal-image"),
  modalPrice: document.getElementById("modal-price"),
  modalDesc: document.getElementById("modal-desc"),
  modalSun: document.getElementById("modal-sun"),
  modalWater: document.getElementById("modal-water"),
  modalStock: document.getElementById("modal-stock"),
  modalCare: document.getElementById("modal-care"),
  modalAddCart: document.getElementById("modal-add-cart"),
  modalWhatsapp: document.getElementById("modal-whatsapp"),
  whatsappHero: document.getElementById("whatsapp-hero"),
  floatingWhatsapp: document.getElementById("floating-whatsapp")
};

let cart = JSON.parse(localStorage.getItem("nursery_cart") || "{}");
let activeCategory = "All";
let activeProduct = null;

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("nursery_cart", JSON.stringify(cart));
}

function cartQty() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function cartTotalValue() {
  return Object.entries(cart).reduce((sum, [id, item]) => {
    const p = products.find(x => x.id === Number(id));
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function waLink(message) {
  return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
}

function setWhatsAppLinks() {
  const msg = `Hello ${ownerName}, I visited your nursery website and want to ask about your plants.`;
  els.whatsappHero.href = waLink(msg);
  els.floatingWhatsapp.href = waLink(msg);
}

function renderCategories() {
  document.querySelectorAll(".category-pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === activeCategory);
  });
}

function productCard(p) {
  return `
    <article class="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
      <img src="${p.image}" alt="${p.name}" class="w-full h-52 object-cover" />
      <div class="p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-lg">${p.name}</h4>
            <p class="text-sm text-slate-500">${p.category}</p>
          </div>
          <div class="text-right">
            <div class="font-black text-lg">${money(p.price)}</div>
            <div class="text-xs ${p.stock > 5 ? "text-green-600" : "text-amber-600"}">${p.stock} in stock</div>
          </div>
        </div>
        <p class="text-sm text-slate-600 line-clamp-2">${p.description}</p>
        <div class="flex gap-2">
          <button class="view-btn flex-1 px-3 py-2 rounded-xl border bg-slate-50 hover:bg-slate-100" data-id="${p.id}">View</button>
          <button class="add-btn flex-1 px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700" data-id="${p.id}">Add</button>
        </div>
        <button class="contact-btn w-full px-3 py-2 rounded-xl border" data-id="${p.id}">Contact for this plant</button>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const featured = products.filter(p => p.featured).slice(0, 4);
  els.featuredGrid.innerHTML = featured.map(productCard).join("");
}

function filteredProducts() {
  const q = els.search.value.trim().toLowerCase();
  return products.filter(p => {
    const matchesText =
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesText && matchesCategory;
  });
}

function renderProducts() {
  const list = filteredProducts();
  els.productsGrid.innerHTML = list.map(productCard).join("");
  els.noResults.classList.toggle("hidden", list.length > 0);
  attachProductActions();
}

function attachProductActions() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = () => addToCart(Number(btn.dataset.id));
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => openModal(Number(btn.dataset.id));
  });

  document.querySelectorAll(".contact-btn").forEach(btn => {
    btn.onclick = () => {
      const p = products.find(x => x.id === Number(btn.dataset.id));
      if (!p) return;
      window.open(
        waLink(`Hello ${ownerName}, I want to ask about ${p.name}. Is it available?`),
        "_blank"
      );
    };
  });
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const current = cart[id]?.qty || 0;
  if (current >= p.stock) {
    alert("Not enough stock.");
    return;
  }
  cart[id] = { qty: current + 1 };
  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function changeQty(id, qty) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  if (qty > p.stock) {
    alert("Not enough stock.");
    return;
  }
  cart[id].qty = qty;
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  els.cartCount.textContent = cartQty();
  els.cartTotal.textContent = money(cartTotalValue());

  const items = Object.entries(cart).map(([id, item]) => {
    const p = products.find(x => x.id === Number(id));
    if (!p) return "";
    return `
      <div class="flex gap-3 p-3 border rounded-2xl">
        <img src="${p.image}" alt="${p.name}" class="w-16 h-16 rounded-xl object-cover" />
        <div class="flex-1">
          <div class="font-semibold">${p.name}</div>
          <div class="text-sm text-slate-500">${money(p.price)} each</div>
          <div class="mt-2 flex items-center gap-2">
            <button class="qty-minus px-2 py-1 border rounded-lg" data-id="${p.id}">-</button>
            <input class="qty-input w-14 text-center border rounded-lg py-1" data-id="${p.id}" value="${item.qty}" />
            <button class="qty-plus px-2 py-1 border rounded-lg" data-id="${p.id}">+</button>
          </div>
        </div>
        <button class="remove-item text-sm text-red-600" data-id="${p.id}">Remove</button>
      </div>
    `;
  }).join("");

  els.cartItems.innerHTML = items || `<div class="text-slate-500">Your cart is empty.</div>`;

  document.querySelectorAll(".qty-minus").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      changeQty(id, (cart[id]?.qty || 1) - 1);
    };
  });

  document.querySelectorAll(".qty-plus").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      changeQty(id, (cart[id]?.qty || 0) + 1);
    };
  });

  document.querySelectorAll(".qty-input").forEach(input => {
    input.onchange = () => {
      const id = Number(input.dataset.id);
      changeQty(id, Number(input.value) || 0);
    };
  });

  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.onclick = () => removeFromCart(Number(btn.dataset.id));
  });
}

function openCart() {
  els.cartDrawer.classList.remove("hidden");
  els.cartDrawer.classList.add("flex");
}

function closeCart() {
  els.cartDrawer.classList.add("hidden");
  els.cartDrawer.classList.remove("flex");
}

function openModal(id) {
  activeProduct = products.find(x => x.id === id);
  if (!activeProduct) return;

  els.modalTitle.textContent = activeProduct.name;
  els.modalCategory.textContent = activeProduct.category;
  els.modalImage.src = activeProduct.image;
  els.modalImage.alt = activeProduct.name;
  els.modalPrice.textContent = money(activeProduct.price);
  els.modalDesc.textContent = activeProduct.description;
  els.modalSun.textContent = activeProduct.sunlight;
  els.modalWater.textContent = activeProduct.watering;
  els.modalStock.textContent = `${activeProduct.stock} available`;
  els.modalCare.textContent = activeProduct.care;
  els.modalWhatsapp.href = waLink(`Hello ${ownerName}, I want to ask about ${activeProduct.name}. Is it available?`);

  els.modal.classList.remove("hidden");
  els.modal.classList.add("flex");
}

function closeModal() {
  els.modal.classList.add("hidden");
  els.modal.classList.remove("flex");
}

function sendCartOnWhatsApp() {
  const lines = Object.entries(cart).map(([id, item]) => {
    const p = products.find(x => x.id === Number(id));
    return p ? `- ${p.name} x ${item.qty} (${money(p.price)})` : null;
  }).filter(Boolean);

  if (!lines.length) {
    alert("Cart is empty.");
    return;
  }

  const msg = `Hello ${ownerName}, I want to order:\n${lines.join("\n")}\n\nTotal: ${money(cartTotalValue())}\nPlease confirm availability and pickup/delivery.`;
  window.open(waLink(msg), "_blank");
}

els.search.addEventListener("input", renderProducts);
els.clearSearch.onclick = () => {
  els.search.value = "";
  renderProducts();
};

document.querySelectorAll(".category-pill").forEach(btn => {
  btn.onclick = () => {
    activeCategory = btn.dataset.category;
    renderCategories();
    renderProducts();
  };
});

els.cartBtn.onclick = openCart;
els.closeCart.onclick = closeCart;
els.clearCart.onclick = () => {
  cart = {};
  saveCart();
  updateCartUI();
};
els.cartWhatsapp.onclick = sendCartOnWhatsApp;
els.closeModal.onclick = closeModal;
els.modalAddCart.onclick = () => {
  if (!activeProduct) return;
  addToCart(activeProduct.id);
  closeModal();
};

els.contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  const waMsg = `Hello ${ownerName}, my name is ${name}. Phone: ${phone}. Message: ${message}`;
  window.open(waLink(waMsg), "_blank");

  e.target.reset();
});

document.getElementById("whatsapp-hero").addEventListener("click", (e) => {
  e.preventDefault();
  window.open(waLink(`Hello ${ownerName}, I visited your nursery website and want to ask about plants.`), "_blank");
});

els.floatingWhatsapp.addEventListener("click", (e) => {
  e.preventDefault();
  window.open(waLink(`Hello ${ownerName}, I want to ask about your plants.`), "_blank");
});

els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeCart();
  }
});

setWhatsAppLinks();
renderCategories();
renderFeatured();
renderProducts();
updateCartUI();
