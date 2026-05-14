const tokenService = require("./token.service");

class AuthService {
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      console.log(refreshToken);

      //   const token = await tokenService.removeToken(refreshToken);

      //   res.clearCookie("refreshToken");
      //   return res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
