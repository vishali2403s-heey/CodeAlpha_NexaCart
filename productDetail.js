const API = "http://localhost:5000/api";

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("productDetails").innerHTML = "<p>Product not found.</p>";
    return;
  }

  const response = await fetch(`${API}/products/${id}`);
  const product = await response.json();

  document.getElementById("productDetails").innerHTML = `
    <div class="detail-card">
      <img src="images/${product.image}" alt="${product.name}">
      <div>
        <p class="badge">${product.badge || "Featured"}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> ₹${product.price}</p>
        <p><strong>Rating:</strong> ${product.rating}</p>
        <button class="cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        <button class="view-btn" onclick="addToWishlist(${product.id})">Save to Wishlist</button>
      </div>
    </div>
  `;
}

async function addToCart(id) {
  await fetch(`${API}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ product_id: id })
  });
  alert("Added to cart");
}

async function addToWishlist(id) {
  await fetch(`${API}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ product_id: id })
  });
  alert("Added to wishlist");
}

loadProduct();
