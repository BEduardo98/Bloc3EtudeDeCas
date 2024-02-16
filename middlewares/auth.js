const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw new Error("Token not provided");
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token");
    }
    const user = await usersService.get(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message));
  }
};
