const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.module");
const tokenService = require("../service/token.service");
const UserDto = require("../dtos/user.dto");
const authService = require("../service/auth.service");
const tokenModel = require("../models/token.model");
const { userMiddleware } = require("../middleware/middleware");
const UserModule = require("../models/User.module");
const BookModule = require("../models/Book.module");
const FavouriteModule = require("../models/Favourite.module");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const getUsers = await User.find();
    const users = UserDto.create(getUsers);

    res.json(users);
  } catch (error) {
    console.log("something wrong!");
  }
});

router.get("/:id", userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);
    const user = UserDto.create(getUser);

    res.json(user);
  } catch (error) {
    console.log("something wrong!");
  }
});

router.put("/update/:id", userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(404)
        .json({ message: "Qandaydur muammo bor qayta urinib koring!" });
    }

    const existingUser = await UserModule.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    const upadeteUser = await UserModule.findByIdAndUpdate(id, data);

    res.json({
      message: "List muvaffaqiyatli yangilandi",
      userOldData: upadeteUser,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await UserModule.findById(id);
    const deleteUser = await UserModule.findByIdAndDelete(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    res.json({ message: "User muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/favourite/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await BookModule.findById(id);

    const savedFavoBook = {
      bookId: existingBook.id.toString(),
      name: existingBook.name,
      description: existingBook.description,
      price: existingBook.price,
      category: existingBook.category,
      images: existingBook.images[0],
      rating: existingBook.rating,
      isActive: existingBook.isActive,
    };

    const newLikedBook = await FavouriteModule.create(savedFavoBook);

    res.status(201).json({
      message: "Kitob muvaffaqiyatli saqlandi",
      book: newLikedBook,
    });

    // res.json(existingBook);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/favourite/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existingBook = await FavouriteModule.findByIdAndDelete(id);

    if (!existingBook) {
      return res
        .status(404)
        .json({ message: "Nimadur xato qayta urinib ko'ring!" });
    }

    res.json({ message: "LikedBook muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
