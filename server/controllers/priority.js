const Model = require("../models/priority");

class Controller {
  async get(req, res, next) {
    try {
      const items = await Model.findAll({ order: ["name"] });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const items = await Model.findAndCountAll({ order: ["name"] });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
