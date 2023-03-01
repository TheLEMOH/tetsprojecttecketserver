const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  if (req.methods == "OPTIONS") {
    next();
  }

  try {
    const token = req.get("Authorization");
    if (!token) {
      throw "Пользователь не авторизован";
    }
    const decodeData = jwt.verify(token, secret);
    req.user = decodeData;
    next();
  } catch (e) {
    return res.status(403).json({ message: e });
  }
};
