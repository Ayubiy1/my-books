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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
