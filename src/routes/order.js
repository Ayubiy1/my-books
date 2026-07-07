const express = require("express");
const Order = require("../models/Order.module.js");
const OrderModule = require("../models/Order.module.js");
const {
  authMiddleware,
  userMiddleware,
  orderMiddleware,
} = require("../middleware/middleware.js");

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all Orders
 *     tags: [Orders]
 *     description: Retrieve a list of all Orders
 *     responses:
 *       200:
 *         description: List of Orders
 */

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const checkOrder = await OrderModule.findOne({ title: req.body.title });

    const newOrder = new OrderModule(req.body);

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order muvaffaqiyatli bajarildi!",
      book: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

router.put("/:id", orderMiddleware, async (req, res) => {
  try {
    const { id, data } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req?.body);

    res.status(200).json({
      message: "Order muvaffaqiyatli yangilandi!",
      book: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

router.delete("/:id", orderMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await OrderModule.findOneAndDelete(id, {
      returnDocument: "after",
    });
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order topilmadi" });
    }

    res.status(200).json({
      message: "Order deleted",
      book: deletedOrder,
    });
  } catch (error) {
    console.log(error);
    console.log("Something wrong!");
  }
});

module.exports = router;
