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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", async (req, res) => {
  try {
    const getUsers = await User.find();
    const users = UserDto.create(getUsers);

    res.json(users);
  } catch (error) {
    console.log("something wrong!");
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get users by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: users ID
 *     responses:
 *       200:
 *         description: users found
 *       404:
 *         description: users not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);
    const user = UserDto.create(getUser);

    res.json(user);
  } catch (error) {
    console.log("something wrong!");
  }
});

{
  // /**
  //  * @swagger
  //  * /users/{id}:
  //  *   put:
  //  *     summary: Update user by ID
  //  *     description: Update an existing user's information. Requires a valid JWT token in the Authorization header.
  //  *     parameters:
  //  *       - in: path
  //  *         name: id
  //  *         required: true
  //  *         schema:
  //  *           type: string
  //  *         description: User ID
  //  *       - in: header
  //  *         name: Authorization
  //  *         required: true
  //  *         schema:
  //  *           type: string
  //  *         description: Bearer token (e.g., "Bearer <JWT>")
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               name:
  //  *                 type: string
  //  *               email:
  //  *                 type: string
  //  *               password:
  //  *                 type: string
  //  *     responses:
  //  *       200:
  //  *         description: User updated successfully
  //  *       404:
  //  *         description: User not found or unauthorized
  //  *       401:
  //  *         description: Invalid or missing token
  //  */
}

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const token = req?.headers?.authorization?.split(" ")[1];
    console.log("token", token);

    if (!token) {
      return res
        .status(404)
        .json({ message: "Qandaydur muammo bor qayta urinib koring!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const existingUser = await UserModule.findById(id);
    const userId = decoded?.id.toString();

    if (!existingUser) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    if (userId !== id) {
      return res.status(404).json({ message: "Ruhsat yo'q!" });
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete an existing user. Requires a valid JWT token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Token missing or invalid
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

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

//

module.exports = router;
