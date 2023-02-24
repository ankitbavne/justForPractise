const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());
let authRoute = require("./routes/auth");
let productRoute = require("./routes/product");

require("./Database/db");

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);

app.listen(5000, () => {
  console.log("Port is Connected on 5000");
});
