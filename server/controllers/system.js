const Model = require("../models/system");

const StatusModel = require("../models/status");

class Controller {
  async create(req, res, next) {
    try {
      await Model.create(req.body);
      res.json({ message: "Системные настройки созданы!" });
    } catch (error) {
      next();
    }
  }

  async get(req, res, next) {
    try {
      const items = await Model.findAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const item = await Model.findOne({
        include: [
          { model: StatusModel, as: "open" },
          { model: StatusModel, as: "close" },
          { model: StatusModel, as: "reject" },
        ],
      });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.update(req.body, { where: { id: id } });
      res.json({ message: "Системные настройки обновлены!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Системные настройки удалены!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
