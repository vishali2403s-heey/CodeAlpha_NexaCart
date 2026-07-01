const API = "http://localhost:5000/api";

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function loadCategories() {
  const response = await fetch(`${API}/categories`);
  const categories = await response.json();
  const container = document.getElementById("categories");
  container.innerHTML = categories.map((category) => `
    <div class="category-card">
      <h3>${category.name}</h3>
      <p>Curated picks for every lifestyle.</p>
      <a href="products.html?category=${category.slug}" class="secondary-btn">Explore</a>
    </div>
  `).join("");
}

async function loadProducts() {
  const response = await fetch(`${API}/products?sort=popular`);
  const products = await response.json();
  document.getElementById("products").innerHTML = renderProducts(products.slice(0, 4));
  document.getElementById("bestSellers").innerHTML = renderProducts(products.slice(4, 8));
  updateCartCount();
}

function renderProducts(products) {
  return products.map((product) => `
    <div class="card">
      <img src="images/${product.image}" alt="${product.name}">
      <span class="badge">${product.badge || "Featured"}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price-row">
        <span>₹${product.price}</span>
        <span>${product.rating} ★</span>
      </div>
      <div class="buttons">
        <button class="cart-btn" onclick="addToCart(${product.id})">Add to cart</button>
        <button class="view-btn" onclick="viewProduct(${product.id})">Details</button>
      </div>
    </div>
  `).join("");
}

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

async function addToCart(id) {
  const response = await fetch(`${API}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ product_id: id })
  });
  const data = await response.json();
  alert(data.message);
  updateCartCount();
}

async function updateCartCount() {
  const response = await fetch(`${API}/cart`, { headers: getAuthHeaders() });
  const data = await response.json();
  const count = data.summary?.itemCount || 0;
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = count;
}

function updateAuthUI() {
  const authLink = document.getElementById("authLink");
  if (!authLink) return;
  const token = localStorage.getItem("token");
  if (token) {
    authLink.href = "profile.html";
    authLink.innerText = "Profile";
  } else {
    authLink.href = "login.html";
    authLink.innerText = "Login";
  }
}

function searchProducts() {
  const term = document.getElementById("searchInput").value;
  window.location.href = `products.html?search=${encodeURIComponent(term)}`;
}

loadCategories();
loadProducts();
updateAuthUI();