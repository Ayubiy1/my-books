const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     _id: String,
//     userId: String,
//     items: [
//       {
//         productId: String,
//         quantity: Number,
//         price: Number,
//       },
//     ],
//     totalPrice: Number,
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "shipped", "delivered"],
//       default: "pending",
//     },
//     shippingAddress: String,
//     paymentMethod: String,
//     createdAt: Date,
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Order", cartSchema);
