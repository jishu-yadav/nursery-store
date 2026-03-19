const products = [
  { id: 1, name: "Rose Plant", price: 10 },
  { id: 2, name: "Tulsi Plant", price: 5 },
  { id: 3, name: "Aloe Vera", price: 7 }
];

let cart = [];

const productContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");

function renderProducts(list) {
  productContainer.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "border p-3 bg-white";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add</button>
    `;

    productContainer.appendChild(div);
  });
}

function addToCart(id) {
  cart.push(id);
  cartCount.innerText = cart.length;
}

document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(val)
  );
  renderProducts(filtered);
});

renderProducts(products);
