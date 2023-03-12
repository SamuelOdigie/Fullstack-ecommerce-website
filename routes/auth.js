const express = require("express");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();

const db = new sqlite3.Database("./ecommerce.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the ecommerce database.");
});

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return console.error(err.message);
    }

    if (row) {
      return res.status(409).send({ message: "Email already exists" });
    }

    const hash = bcrypt.hashSync(password, 10);

    db.run(
      `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `,
      [username, email, hash],
      (err) => {
        if (err) {
          return console.error(err.message);
        }

        res.status(201).send({ message: "User created" });
      }
    );
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return console.error(err.message);
    }

    if (!row) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const validPassword = bcrypt.compareSync(password, row.password);

    if (!validPassword) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    req.session.userId = row.id;

    res.send({ message: "Logged in" });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send({ message: "Logged out" });
});

module.exports = router;
