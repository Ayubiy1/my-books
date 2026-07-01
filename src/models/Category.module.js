const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: String, // category rasmi (banner uchun)
    slug: String,
    icon: String,
    parentCategory: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
