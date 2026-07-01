const API = "http://localhost:5000/api";

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function loadCart() {
  const response = await fetch(`${API}/cart`, { headers: getAuthHeaders() });
  const data = await response.json();
  const items = data.items || [];
  const summary = data.summary || { itemCount: 0, total: 0, shipping: 0, grandTotal: 0 };

  const cartContainer = document.getElementById("cart");
  const summaryContainer = document.getElementById("cart-summary");

  if (!cartContainer || !summaryContainer) return;

  if (!items.length) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    summaryContainer.innerHTML = "";
    return;
  }

  cartContainer.innerHTML = items.map((item) => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price} × ${item.quantity}</p>
      </div>
      <div class="cart-actions">
        <button onclick="updateQuantity(${item.id}, ${Math.max(1, item.quantity - 1)})">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        <button onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join("");

  summaryContainer.innerHTML = `
    <h3>Order Summary</h3>
    <p>Items: ${summary.itemCount}</p>
    <p>Subtotal: ₹${summary.total}</p>
    <p>Shipping: ₹${summary.shipping}</p>
    <p><strong>Total: ₹${summary.grandTotal}</strong></p>
    <a href="checkout.html" class="secondary-btn">Proceed to Checkout</a>
  `;
}

async function updateQuantity(id, quantity) {
  await fetch(`${API}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ quantity })
  });
  loadCart();
}

async function removeItem(id) {
  await fetch(`${API}/cart/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  loadCart();
}

async function placeOrder() {
  const payload = {
    customer_name: document.getElementById("customerName").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    paymentMethod: document.getElementById("paymentMethod").value
  };

  const response = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  document.getElementById("orderMsg").innerHTML = data.message;

  if (data.success) {
    setTimeout(() => (window.location.href = "index.html"), 800);
  }
}

loadCart();