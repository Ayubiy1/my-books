const express = require("express");
const Order = require("../models/Order.module.js");
const OrderModule = require("../models/Order.module.js");
const {
  authMiddleware,
  userMiddleware,
  orderMiddleware,
} = require("../middleware/middleware.js");
const Cart = require("../models/Cart.module.js");

const router = express.Router();

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get all Carts
 *     tags: [Carts]
 *     description: Retrieve a list of all Carts
 *     responses:
 *       200:
 *         description: List of Carts
 */

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get carts by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Carts found
 *       404:
 *         description: Carts not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     description: Add a new cart. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - totalPrice
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "64a1f2b3c4d5e6f7a8b9c0d2"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 19.99
 *               totalPrice:
 *                 type: number
 *                 example: 39.98
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 example: pending
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Something went wrong
 */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const checkCart = await Order.findOne({ title: req.body.title });

    const newCart = new Cart(req.body);

    const savedCart = await newCart.save();

    res.status(201).json({
      message: "Cart muvaffaqiyatli bajarildi!",
      book: savedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   put:
 *     summary: Update an existing cart
 *     tags: [Carts]
 *     description: Update an cart by ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

router.put("/:id", async (req, res) => {
  try {
    const { id, data } = req.params;
    const updatedCart = await Cart.findByIdAndUpdate(id, req?.body);

    res.status(200).json({
      message: "Cart muvaffaqiyatli yangilandi!",
      book: updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /carts/{id}:
 *   delete:
 *     summary: Delete an cart by ID
 *     tags: [Carts]
 *     description: Delete an existing order. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart to delete
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

router.delete("/:id", orderMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCart = await Cart.findOneAndDelete(id, {
      returnDocument: "after",
    });
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart topilmadi" });
    }

    res.status(200).json({
      message: "Cart deleted",
      book: deletedCart,
    });
  } catch (error) {
    console.log(error);
    console.log("Something wrong!");
  }
});

module.exports = router;
