const jwt = require("jsonwebtoken");
const UserModule = require("../models/User.module");
const UserDto = require("../dtos/user.dto");
const tokenModel = require("../models/token.model");

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
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(404)
        .json({ message: "Qandaydur muammo bor qayta urinib koring!" });
    }

    const userCheck = await UserModule.findById(id);
    if (!userCheck) {
      return res.status(404).json({ message: "Bunaday User mavjud emas!" });
    }

    const checkToken = await tokenModel.findOne({ refreshToken });
    if (checkToken?.user.toString() !== id) {
      return res.status(404).json({ message: "something wrong try again!" });
    }

    const user = new UserDto(userCheck);
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  authMiddleware,
  userMiddleware,
};

{
  // module.exports = function (req, res, next) {
  //   try {
  //     const authHeader = req.headers.authorization;
  //     const token = authHeader.split(" ")[1];
  //     console.log(authHeader);
  //     if (!token) {
  //       return res
  //         .status(401)
  //         .json({ message: "Nimadur hato qayta login qilib ko'ring" });
  //     }
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = decoded;
  //     next();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}
