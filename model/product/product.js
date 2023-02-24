const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: { type: String },
    desc: { type: String },

    price: { type: String },

    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
