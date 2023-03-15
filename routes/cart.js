const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/", (req, res) => {
  const cart = require("../cart.json");

  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).send("productId and quantity are required");
  }

  const product = cart.items.find((item) => item.productId === productId);

  if (product) {
    product.quantity += quantity;
  } else {
    cart.items.push({
      productId: productId,
      quantity: quantity,
    });
  }

  try {
    fs.writeFileSync("./cart.json", JSON.stringify(cart, null, 2));
    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to add item to cart");
  }
});

router.get("/", (req, res) => {
  const cart = require("../cart.json");
  res.send(cart);
});

module.exports = router;
