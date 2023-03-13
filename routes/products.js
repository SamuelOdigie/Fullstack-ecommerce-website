const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const products = require("../products.json");
  res.send(products);
});

module.exports = router;
