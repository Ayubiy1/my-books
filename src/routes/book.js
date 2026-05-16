const express = require("express");
const BookModule = require("../models/Book.module");
const { authMiddleware } = require("../middleware/middleware");

const router = express.Router();

router.get("/get-all", async (req, res) => {
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

router.get("/get-one/:id", async (req, res) => {
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

router.post("/create", async (req, res) => {
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

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const upadateBook = await BookModule.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });

    res.status(201).json(upadateBook);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "something wrong!",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
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
