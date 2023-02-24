const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", User);
