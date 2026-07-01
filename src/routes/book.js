const express = require("express");
const BookModule = require("../models/Book.module");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: List of products
 */

router.get("/", async (req, res) => {
  try {
    const books = await BookModule.find();

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await BookModule.findById(id);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new book
 *     description: Add a new book to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Clean Code"
 *               author:
 *                 type: string
 *                 example: "Robert C. Martin"
 *               publishedYear:
 *                 type: integer
 *                 example: 2008
 *               genre:
 *                 type: string
 *                 example: "Programming"
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Something went wrong
 */

router.post("/", async (req, res) => {
  try {
    const newBook = new BookModule(req.body);

    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Kitob muvaffaqiyatli yaratildi",
      book: savedBook,
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
 * /products/{id}:
 *   put:
 *     summary: Update book by ID
 *     description: Update an existing book. Requires a valid JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Clean Code (Updated)"
 *               author:
 *                 type: string
 *                 example: "Robert C. Martin"
 *               publishedYear:
 *                 type: integer
 *                 example: 2009
 *               genre:
 *                 type: string
 *                 example: "Programming"
 *     responses:
 *       201:
 *         description: Book updated successfully
 *       401:
 *         description: Token missing or invalid
 *       404:
 *         description: Book not found
 */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // const upadateBook = await BookModule.findByIdAndUpdate(id, req.body, {
    //   returnDocument: "after",
    // });

    // res.status(201).json(upadateBook);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete book by ID
 *     description: Delete an existing book by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await BookModule.findOneAndDelete(id, {
      returnDocument: "after",
    });
    if (!deletedBook) {
      return res.status(404).json({ error: "Book topilmadi" });
    }

    res.status(200).json({
      message: "Book deleted",
      book: deletedBook,
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
