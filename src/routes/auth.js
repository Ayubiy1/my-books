const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.module");
const tokenService = require("../service/token.service");
const UserDto = require("../dtos/user.dto");
const authService = require("../service/auth.service");
const tokenModel = require("../models/token.model");

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user?._id, role: user?.role }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

const generateToken = (user) => {
  const accessToken = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
      token: generateAccessToken(newUser),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Register error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log("User don't found");
      return res.status(400).json({
        message: "User don't found",
      });
    }

    const checkPass = await bcrypt.compare(password, existingUser.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const userDto = new UserDto(existingUser);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto?.id, tokens.refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnyl: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      userDto,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token topilmadi" });
    }

    const existingToken = await tokenModel.findOne({
      refreshToken: refreshToken.toString(),
    });

    if (!existingToken) {
      return res.status(404).json({ message: "Token topilmadi" });
    }

    await tokenService.removeToken(refreshToken);

    res.clearCookie("refreshToken"); // tavsiya qilinadi
    return res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

{
  // router.post("/logout", async (req, res) => {
  //   try {
  //     const refreshToken = req.cookies?.refreshToken;
  //     console.log(refreshToken);
  //     const existingToken = await tokenModel.findOne({ refreshToken });
  //     if (!existingToken) {
  //       console.log("User don't found");
  //     }
  //     await tokenService.removeToken(refreshToken);
  //     res.json({ message: "Successfully!" });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
}
