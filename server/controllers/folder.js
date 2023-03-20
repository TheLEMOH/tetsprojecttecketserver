const Model = require("../models/folder");

const CreateFilter = require("../scripts/filter");

class Controller {
  async create(req, res, next) {
    try {
      const { name, description, filter } = req.body;
      const newFilter = CreateFilter(filter);
      await Model.create({ name, description, filter: newFilter });
      res.json({ message: "Папка создана!" });
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
      const items = await Model.findAndCountAll({ order: ["name"] });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const area = await Model.findOne({ where: { id: id } });
      res.json(area);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const { name, description, filter } = req.body;
      const newFilter = CreateFilter(filter);
      await Model.update({ name, description, filter: newFilter }, { where: { id: id } });
      res.json({ message: "Папка обновлена!" });
    } catch (error) {
      next();
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await Model.destroy({ where: { id: id } });
      res.json({ message: "Папка удалена!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
