const jwt = require("jsonwebtoken");
const UserModule = require("../models/User.module");
const UserDto = require("../dtos/user.dto");
const tokenModel = require("../models/token.model");
const OrderModule = require("../models/Order.module");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token topilmadi",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token noto'g'ri yoki eskirgan",
    });
  }
};

const userMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const refreshToken = req?.headers?.authorization?.split(" ")[1];

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const existingUser = await UserModule.findById(id);
    const userId = decoded?.id.toString();

    if (!refreshToken) {
      return res
        .status(404)
        .json({ message: "Qandaydur muammo bor qayta urinib koring!" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    if (userId !== id) {
      return res.status(404).json({ message: "Ruhsat yo'q!" });
    }

    const user = new UserDto(decoded);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({ message: "Token topilmadi!" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User mavjud emas!" });
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Ruxsat yo'q!" });

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token muddati tugagan yoki noto'g'ri!" });
  }
};

const orderMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const refreshToken = req?.headers?.authorization?.split(" ")[1];

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const existingOrder = await OrderModule.findById(id);
    const userId = decoded?.id.toString();

    if (!refreshToken) {
      return res
        .status(404)
        .json({ message: "Qandaydur muammo bor qayta urinib koring!" });
    }

    if (!existingOrder) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    if (userId !== existingOrder?.userId) {
      return res
        .status(404)
        .json({ message: "Siz bunday imkoniyatdan foydalana olmaysiz!" });
    }

    const user = new UserDto(decoded);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  authMiddleware,
  userMiddleware,
  adminMiddleware,
  orderMiddleware,
};
