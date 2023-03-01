const Model = require("../models/organization");
const CreateFilter = require("../scripts/filter");

class Controller {
  async create(req, res, next) {
    try {
      if (req.body.isHead) {
        const head = await Model.findOne({ where: { isHead: true } });

        if (head) throw "Головная организация уже существует";
      }

      await Model.create(req.body);
      res.json({ message: "Организация добавлена!" });
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
      const { page, limit, shortName, name, isHead, address } = req.query;
      const offset = page * limit;
      const filter = CreateFilter({ shortName, name, isHead, address });
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
      next();
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;

      if (req.body.isHead) {
        const head = await Model.findOne({ where: { isHead: true } });

        if (head && head.id != id) throw "Головная организация уже существует";
      }

      const items = await Model.update(req.body, { where: { id: id } });
      res.json({ message: "Организация обновлена!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Организация удалена!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
