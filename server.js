require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

const app = express();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const initializeTables = () => {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      profile_image VARCHAR(255),
      role VARCHAR(50) DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      image VARCHAR(255),
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255),
      description TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount INT DEFAULT 0,
      image VARCHAR(255),
      images TEXT,
      category VARCHAR(100),
      badge VARCHAR(50),
      rating DECIMAL(2,1) DEFAULT 4.5,
      reviews INT DEFAULT 120,
      stock INT DEFAULT 10,
      specs TEXT,
      delivery_info TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS wishlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      product_id INT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      customer_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address TEXT,
      total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      payment_method VARCHAR(50),
      item_count INT NOT NULL DEFAULT 0,
      status VARCHAR(50) DEFAULT 'Pending',
      order_number VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      product_name VARCHAR(255),
      quantity INT NOT NULL DEFAULT 1,
      price DECIMAL(10,2) DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      user_name VARCHAR(255),
      rating INT DEFAULT 5,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  const runStatement = (index = 0) => {
    if (index >= statements.length) {
      runMigrations();
      seedInitialData();
      return;
    }

    db.query(statements[index], (error) => {
      if (error) {
        console.error("Table initialization error:", error.message);
      }
      runStatement(index + 1);
    });
  };

  runStatement();
};

const runMigrations = () => {
  const migrations = [
    { table: "users", column: "profile_image", definition: "profile_image VARCHAR(255)" },
    { table: "products", column: "brand", definition: "brand VARCHAR(255)" },
    { table: "products", column: "discount", definition: "discount INT DEFAULT 0" },
    { table: "products", column: "images", definition: "images TEXT" },
    { table: "products", column: "reviews", definition: "reviews INT DEFAULT 120" },
    { table: "products", column: "specs", definition: "specs TEXT" },
    { table: "products", column: "delivery_info", definition: "delivery_info TEXT" },
    { table: "cart", column: "user_id", definition: "user_id INT DEFAULT NULL" },
    { table: "wishlist", column: "user_id", definition: "user_id INT DEFAULT NULL" },
    { table: "orders", column: "user_id", definition: "user_id INT DEFAULT NULL" },
    { table: "orders", column: "order_number", definition: "order_number VARCHAR(50)" }
  ];

  const applyNextMigration = (index = 0) => {
    if (index >= migrations.length) {
      return;
    }

    const migration = migrations[index];
    db.query(`SHOW COLUMNS FROM ${migration.table} LIKE ?`, [migration.column], (error, rows) => {
      if (error) {
        console.error("Migration error:", error.message);
        return applyNextMigration(index + 1);
      }

      if (rows.length === 0) {
        db.query(`ALTER TABLE ${migration.table} ADD COLUMN ${migration.definition}`, (alterError) => {
          if (alterError) {
            console.error("Migration error:", alterError.message);
          }
          applyNextMigration(index + 1);
        });
      } else {
        applyNextMigration(index + 1);
      }
    });
  };

  applyNextMigration();
};

const seedInitialData = () => {
  db.query("SELECT COUNT(*) AS count FROM categories", (err, result) => {
    if (!err && result[0].count === 0) {
      const categories = [
        ["Men", "men", "bag.jpg", "Modern essentials for men"],
        ["Women", "women", "boat.jpg", "Elegant and everyday fashion"],
        ["Kids", "kids", "nike.jpg", "Fun, practical essentials"],
        ["Shoes", "shoes", "S25.jpg", "Comfort and style"],
        ["Beauty", "beauty", "bag.jpg", "Beauty essentials"],
        ["Electronics", "electronics", "iphone15.jpg", "Smart lifestyle tech"],
        ["Mobiles", "mobiles", "iphone15.jpg", "Connected and compact"],
        ["Watches", "watches", "nike.jpg", "Modern timepieces"],
        ["Bags", "bags", "bag.jpg", "Utility and luxury"],
        ["Accessories", "accessories", "boat.jpg", "Style details"],
        ["Jewellery", "jewellery", "bag.jpg", "Refined pieces"],
        ["Home & Kitchen", "home-kitchen", "boat.jpg", "Everyday comfort"],
        ["Furniture", "furniture", "nike.jpg", "Designed for comfort"],
        ["Gaming", "gaming", "iphone15.jpg", "Performance gear"]
      ];

      categories.forEach(([name, slug, image, description]) => {
        db.query("INSERT INTO categories(name, slug, image, description) VALUES (?, ?, ?, ?)", [name, slug, image, description]);
      });
    }
  });

  db.query("SELECT COUNT(*) AS count FROM products", (err, result) => {
    if (!err && result[0].count === 0) {
      const categoryOptions = [
        { name: "Men", brands: ["Levis", "Allen Solly", "Raymond", "Peter England"] },
        { name: "Women", brands: ["Zara", "H&M", "Biba", "Myntra"] },
        { name: "Kids", brands: ["Hopscotch", "Nino", "Mokobara", "Puma Kids"] },
        { name: "Shoes", brands: ["Nike", "Adidas", "Puma", "Skechers"] },
        { name: "Beauty", brands: ["Lakme", "Maybelline", "Nivea", "L'Oreal"] },
        { name: "Electronics", brands: ["Sony", "Dell", "Logitech", "Boat"] },
        { name: "Mobiles", brands: ["Apple", "Samsung", "OnePlus", "Nothing"] },
        { name: "Watches", brands: ["Titan", "Fastrack", "Apple", "Rolex"] },
        { name: "Bags", brands: ["American Tourister", "Wildcraft", "Hidesign", "Caprese"] },
        { name: "Accessories", brands: ["Fossil", "Ray-Ban", "Mango", "Baggit"] },
        { name: "Jewellery", brands: ["Tanishq", "CaratLane", "Verride", "Mia"] },
        { name: "Home & Kitchen", brands: ["Philips", "Prestige", "Milton", "Havells"] },
        { name: "Furniture", brands: ["Wakefit", "Urban Ladder", "Godrej", "Nilkamal"] },
        { name: "Gaming", brands: ["Razer", "HyperX", "Corsair", "SteelSeries"] }
      ];

      const images = ["bag.jpg", "boat.jpg", "iphone15.jpg", "nike.jpg", "S25.jpg"];
      const sampleNames = [
        "Signature", "Aura", "Nova", "Elite", "Prime", "Classic", "Flex", "Luxe", "Metro", "Orbit"
      ];

      for (let i = 1; i <= 100; i += 1) {
        const category = categoryOptions[(i - 1) % categoryOptions.length];
        const brand = category.brands[(i - 1) % category.brands.length];
        const baseName = `${sampleNames[(i - 1) % sampleNames.length]} ${category.name} ${i}`;
        const price = 899 + ((i * 137) % 17000);
        const discount = [0, 5, 10, 15, 20, 25][(i - 1) % 6];
        const rating = (4.1 + ((i % 9) * 0.1)).toFixed(1);
        const reviews = 120 + ((i * 17) % 500);
        const stock = 5 + (i % 20);
        const imagesList = [images[(i - 1) % images.length], images[(i + 1) % images.length], images[(i + 2) % images.length]];
        const description = `${brand} ${category.name.toLowerCase()} product crafted for daily comfort, modern style, and dependable quality.`;
        const specs = JSON.stringify({
          material: "Premium fabric",
          color: "Midnight",
          warranty: "1 Year"
        });
        const delivery = "Fast delivery across India, free shipping above ₹999";
        db.query(
          "INSERT INTO products(name, brand, description, price, discount, image, images, category, badge, rating, reviews, stock, specs, delivery_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [baseName, brand, description, price, discount, imagesList[0], JSON.stringify(imagesList), category.name, i % 4 === 0 ? "Hot" : "New", rating, reviews, stock, specs, delivery]
        );
      }
    }
  });
};

initializeTables();
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});