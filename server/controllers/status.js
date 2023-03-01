const Model = require("../models/status");
const CreateFilter = require("../scripts/filter");
class Controller {
  async create(req, res, next) {
    try {
      await Model.create(req.body);
      res.json({ message: "Статус создан!" });
    } catch (error) {
      next(error);
    }
  }

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
      const { page, limit, name, nameForInternalUsers, nameForExternalUsers } =
        req.query;
      const offset = page * limit;
      const filter = CreateFilter({
        name,
        nameForInternalUsers,
        nameForExternalUsers,
      });
      const items = await Model.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order: ["name"],
      });

      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const item = await Model.findOne({ where: { id: id } });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.update(req.body, { where: { id: id } });
      res.json({ message: "Статус обновлен!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Статус удален!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
