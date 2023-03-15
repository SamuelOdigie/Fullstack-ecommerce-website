const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const productsRouter = require("./routes/products");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Use the cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static(__dirname + "/public"));

const db = new sqlite3.Database("./ecommerce.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the ecommerce database.");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT
    )
  `);
});

app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
