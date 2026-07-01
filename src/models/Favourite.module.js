const mongoose = require("mongoose");

const favouriteBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    bookId: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Favourite", favouriteBookSchema);
