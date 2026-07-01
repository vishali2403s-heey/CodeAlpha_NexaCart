# CodeAlpha_NexaCart# 🛒 NexaCart - Full Stack E-Commerce Website

NexaCart is a modern full-stack e-commerce website developed using **Node.js, Express.js, MySQL, HTML, CSS, and JavaScript**. It provides a responsive shopping experience with authentication, product browsing, shopping cart, wishlist, and order management.

---

## 📌 Features

### 👤 User Authentication
- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing (bcrypt)
- Logout
- User Profile

### 🛍️ Products
- View Products
- Product Details
- Category-wise Products
- Search Products
- Responsive Product Cards

### ❤️ Wishlist
- Add to Wishlist
- Remove from Wishlist
- View Wishlist

### 🛒 Shopping Cart
- Add to Cart
- Remove from Cart
- Update Quantity
- View Total Price

### 📦 Orders
- Checkout
- Place Orders
- Order History
- Order Status

### 👨‍💼 Admin
- Add Products
- Edit Products
- Delete Products
- Manage Orders
- Manage Users

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JWT (JSON Web Token)
- bcrypt

---

## 📁 Project Structure

```
NexaCart
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── css
│   ├── js
│   ├── images
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   ├── product.html
│   ├── cart.html
│   ├── wishlist.html
│   ├── checkout.html
│   ├── profile.html
│   └── admin.html
│
├── database
│   └── nexacart.sql
│
└── README.md
```

---

## 💾 Database

Database Name:

```
nexacart
```

Main Tables:

- users
- products
- cart
- wishlist
- orders
- order_items

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/NexaCart.git
```

### Navigate to Backend

```bash
cd NexaCart/backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=nexacart

JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Project

Start the backend server:

```bash
npm run dev
```

Open the website:

```
http://localhost:5000
```

---

## 📷 Screenshots
<img width="956" height="887" alt="image" src="https://github.com/user-attachments/assets/15b1fb1c-144e-4355-9323-94741b71663e" />
<img width="957" height="286" alt="image" src="https://github.com/user-attachments/assets/04db3774-2f09-45d0-a8b0-a76dfd7dc708" />

- Home Page
- Login Page
- Register Page
- Products
- Product Details
- Shopping Cart
- Wishlist
- Checkout
- Orders
- Admin Dashboard

(Add screenshots here after completing the project.)

---

## 🚀 Future Improvements

- Online Payment Gateway
- Product Reviews
- Coupons & Discounts
- Email Notifications
- Order Tracking
- AI Product Recommendations
- Dark Mode
- Multi-language Support

---

## 👩‍💻 Developer

**VISHALI S**

B.Tech – Artificial Intelligence and Machine Learning

SRM Institute of Science and Technology

GitHub: https://github.com/vishali2403s-heey/CodeAlpha_NexaCart.git



---

## 📄 License

This project is created for educational and portfolio purposes.

© 2026 VISHALI S. All Rights Reserved.
