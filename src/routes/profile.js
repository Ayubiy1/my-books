const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../models/User.module");
const tokenService = require("../service/token.service");
const UserDto = require("../dtos/user.dto");
const authService = require("../service/auth.service");
const tokenModel = require("../models/token.model");
const { userMiddleware } = require("../middleware/middleware");
const UserModule = require("../models/User.module");

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

module.exports = router;
