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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        type: String,
      },
    ],
    numberSold: {
      type: Number,
      default: 0, // 🔥 Product umumiy sotilgan soni
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    rating: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
