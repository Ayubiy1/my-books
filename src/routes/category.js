const express = require("express");
const BookModule = require("../models/Book.module");
const { authMiddleware, adminMiddleware } = require("../middleware/middleware");
const CategoryModule = require("../models/Category.module");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     responses:
 *       200:
 *         description: List of categories
 *       404:
 *         description: Something went wrong
 */

router.get("/", async (req, res) => {
  try {
    const category = await CategoryModule.find();

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Something wrong! try again",
    });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a single category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModule.findById(id);
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong! try again",
    });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new category. Requires admin privileges.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Programming"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Something went wrong
 */

router.post("/", adminMiddleware, async (req, res) => {
  try {
    const newCategory = new CategoryModule(req.body);

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category muvaffaqiyatli qo'shildi",
      category: savedCategory,
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
 * /categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     description: Update an existing category. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category"
 *     responses:
 *       201:
 *         description: Category updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const upadateCategory = await CategoryModule.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
      },
    );

    res.status(201).json(upadateCategory);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     description: Delete an existing category by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await CategoryModule.findOneAndDelete(id, {
      returnDocument: "after",
    });
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category topilmadi" });
    }

    res.status(200).json({
      message: "Category deleted",
      category: deletedCategory,
    });
  } catch (error) {
    console.log(error);
    console.log("Something wrong!");
  }
});

router.get("/filter", async (req, res) => {
  try {
  } catch (error) {
    console.log("something wrong!");
  }
});

module.exports = router;
