const AreaModel = require("../models/area");
const UserModel = require("../models/user");
const CreateFilter = require("../scripts/filter");

class Controller {
  async create(req, res) {
    try {
      await AreaModel.create(req.body);
      res.json({ message: "Область добавлена!" });
    } catch (e) {
      next();
    }
  }

  async get(req, res, next) {
    try {
      const items = await AreaModel.findAll({
        order: ["name"],
        attributes: ["id", "name", "description"],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const { page, limit, name } = req.query;

      const filter = CreateFilter({ name });
      const offset = page * limit;

      const items = await AreaModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order: ["name"],
        attributes: ["id", "name", "description"],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getWithNodes(req, res, next) {
    const items = await AreaModel.findAll();
    res.json(items);
  }

  async getByUser(req, res, next) {
    try {
      const clientId = req.clientId;
      const item = await UserModel.findOne({ where: { id: clientId }, attributes: ["id"], include: [{ model: AreaModel }] });
      const areas = item.areas;
      res.json(areas);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const area = await AreaModel.findOne({ where: { id: id } });
      res.json(area);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const items = await AreaModel.update(req.body, { where: { id: id } });
      res.json({ message: "Область обновлена!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await AreaModel.destroy({ where: { id: id } });
      res.json({ message: "Область удалена!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
