const UserModel = require("../models/user");
const RoleModel = require("../models/role");
const FolderModel = require("../models/folder");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { secret } = require("../config");

const generateAccessToken = (id, role) => {
  const payload = { id, role };
  return jwt.sign(payload, secret, { expiresIn: "8h" });
};

class Controller {
  async login(req, res, next) {
    try {
      const data = req.get("Authorization");

      const buff = Buffer.from(data, "base64").toString("utf8");

      const email = buff.split(":")[0];
      const password = buff.split(":")[1];

      const client = await UserModel.findOne({
        where: { email },
        include: [{ model: RoleModel }, { model: FolderModel }],
      });

      if (!client) {
        res.status(400).json(null);
      } else {
        const validPassword = bcrypt.compareSync(password, client.dataValues.password);

        if (validPassword) {
          const token = generateAccessToken(client.dataValues.id, client.dataValues.role.level);

          res.json({ client, token });
        } else res.status(400).json(null);
      }
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const data = req.get("Authorization");
      const token = jwt.verify(data, secret);
      if (token) {
        const id = token.id;
        const user = await UserModel.findOne({
          where: { id },
          include: [{ model: RoleModel }, { model: FolderModel }],
        });
        res.json(user);
      }
    } catch (e) {
      res.status(400).json(null);
    }
  }
}

module.exports = new Controller();
