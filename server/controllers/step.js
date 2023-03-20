const Model = require("../models/step");
const UserModel = require("../models/user");

class Controller {
  async getByFilter(req, res, next) {
    try {
      const { organizationId, wayId } = req.query;

      const items = await Model.findAll({
        where: { organizationId, wayId },
        order: [["stepNumber", "ASC"]],
        include: [{ model: UserModel, attributes: ["surname", "name", "patronymic"] }],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
