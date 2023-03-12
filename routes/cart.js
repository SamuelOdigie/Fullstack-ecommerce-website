const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/", (req, res) => {
  const cart = require("../data/cart.json");

  const { productId, quantity } = req.body;

  const product = cart.items.find((item) => item.productId === productId);

  if (product) {
    product.quantity += quantity;
  } else {
    cart.items.push({
      productId: productId,
      quantity: quantity,
    });
  }

  fs.writeFileSync("./data/cart.json", JSON.stringify(cart, null, 2));

  res.send(cart);
});

router.get("/", (req, res) => {
  const cart = require("../data/cart.json");
  res.send(cart);
});

module.exports = router;
