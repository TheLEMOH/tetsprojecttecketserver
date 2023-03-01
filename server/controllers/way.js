const Model = require("../models/way");

const UserModel = require("../models/user");
const OrganizationModel = require("../models/organization");
const StepModel = require("../models/step");

class Controller {
  async create(req, res, next) {
    try {
      const way = await Model.create(req.body);
      way.addOrganization(req.body.organizations);
      const steps = await StepModel.bulkCreate(req.body.steps);
      way.addSteps(steps);
      res.json({ message: "Путь добавлен!" });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const ways = await Model.findAll();
      res.json(ways);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const offset = page * limit;

      const ways = await Model.findAndCountAll({
        offset: offset,
        limit: limit,
        order: ["name"],
      });

      res.json(ways);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const way = await Model.findOne({
        where: { id: id },
        order: ["name"],
        include: [
          {
            model: OrganizationModel,
            include: [
              {
                model: StepModel,
                include: [
                  {
                    model: UserModel,
                    attributes: ["id", "name", "surname", "patronymic", "subdivision"],
                    include: [
                      {
                        model: OrganizationModel,
                        attributes: ["id", "shortName", "name"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      res.json(way);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const way = await Model.findOne({
        where: { id: id },
      });

      const newSteps = req.body.steps.filter((s) => !s.id);
      const oldSteps = req.body.steps.filter((s) => s.id);
      const deleteSteps = req.body.deleteSteps;

      const createdSteps = await StepModel.bulkCreate(newSteps);

      for (let i = 0, length = oldSteps.length; i < length; i++) {
        await StepModel.update(oldSteps[i], { where: { id: oldSteps[i].id } });
      }

      way.addSteps(createdSteps);
      way.removeSteps(deleteSteps);
      way.setOrganizations(req.body.organizations);

      await Model.update(req.body, { where: { id: deleteSteps } });
      await StepModel.destroy({ where: { id: deleteSteps } });

      res.json({ message: "Путь обновлен!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Путь удален!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
