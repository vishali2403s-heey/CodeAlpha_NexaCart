const API = "http://localhost:5000/api";

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function loadFilters() {
  const response = await fetch(`${API}/categories`);
  const categories = await response.json();
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="">All categories</option>` + categories.map((category) => `<option value="${category.name}">${category.name}</option>`).join("");
}

async function loadProducts() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || document.getElementById("categoryFilter")?.value || "";
  const search = params.get("search") || "";
  const sort = document.getElementById("sortFilter")?.value || "featured";

  const response = await fetch(`${API}/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&sort=${sort}`);
  const products = await response.json();

  document.getElementById("products").innerHTML = products.length ? products.map((product) => `
    <div class="card">
      <img src="images/${product.image}" alt="${product.name}">
      <span class="badge">${product.badge || "Featured"}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price-row"><span>₹${product.price}</span><span>${product.rating} ★</span></div>
      <div class="buttons">
        <button class="cart-btn" onclick="addToCart(${product.id})">Add to cart</button>
        <button class="view-btn" onclick="viewProduct(${product.id})">Details</button>
      </div>
    </div>
  `).join("") : "<p>No products found.</p>";
}

async function addToCart(id) {
  const response = await fetch(`${API}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ product_id: id })
  });
  const data = await response.json();
  alert(data.message);
}

function viewProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

document.getElementById("categoryFilter").addEventListener("change", loadProducts);
document.getElementById("sortFilter").addEventListener("change", loadProducts);

loadFilters();
loadProducts();