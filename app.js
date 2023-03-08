const express = require("express");
const app = express();
const PORT = 5000;
app.listen(PORT, () =>
  console.log("your server is running on localhost " + PORT)
);
