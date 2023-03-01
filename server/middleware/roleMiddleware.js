const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles = [1, 2, 3, 4]) {
  return function (req, res, next) {
    if (req.methods == "OPTIONS") {
      next();
    }

    try {
      const token = req.get("Authorization");

      if (!token) throw "Пользователь не авторизован";

      const { role } = jwt.verify(token, secret);

      req.role = role;

      if (roles.includes(role)) next();
      else throw "Пользователь не имеет доступа";
    } catch (e) {
      return res.status(403).json({ message: e.toString() });
    }
  };
};
