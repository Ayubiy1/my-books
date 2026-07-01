const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    profImage: String,
    readings: { type: Number, default: 0 },
    contribution: { type: Number, default: 0 },
    googleId: { type: String }, // Google login uchun
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
