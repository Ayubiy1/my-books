const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryId: String,
    images: [
      {
        type: String,
      },
    ],
    numberSold: {
      type: Number,
      default: 0, // productni umumiy sotilgan soni
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: String,
    },
    rating: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
