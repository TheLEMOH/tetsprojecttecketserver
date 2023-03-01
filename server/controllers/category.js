const Model = require("../models/category");

const WayModel = require("../models/way");
const StepModel = require("../models/step");
const PriorityModel = require("../models/priority");

const CreateFilter = require("../scripts/filter");

class Controller {
  async create(req, res, next) {
    try {
      await Model.create(req.body);
      res.json({ message: "Категория добавлена!" });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const items = await Model.findAll({
        attributes: ["id", "name"],
        order: ["name"],
        include: [
          {
            model: WayModel,
            attributes: ["name"],
          },
          {
            model: PriorityModel,
            attributes: ["name"],
          },
        ],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const { page, limit, name, priorityId, wayId, disabledEditor } = req.query;
      const offset = page * limit;
      const filter = CreateFilter({ name, priorityId, wayId, disabledEditor });
      const items = await Model.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        attributes: ["id", "name", "description"],
        order: ["name"],
        include: [
          { model: WayModel, attributes: ["name"] },
          {
            model: PriorityModel,
            attributes: ["name"],
          },
        ],
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
      res.json({ message: "Категория обновлена!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Категория удалена!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
