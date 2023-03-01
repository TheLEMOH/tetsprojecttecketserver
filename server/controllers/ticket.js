const CategoryModel = require("../models/category");
const Model = require("../models/ticket");
const WayModel = require("../models/way");
const StepModel = require("../models/step");
const UserModel = require("../models/user");
const OrganizationModel = require("../models/organization");
const PriorityModel = require("../models/priority");
const StatusModel = require("../models/status");
const SystemModel = require("../models/system");
const MessageModel = require("../models/message");

const { Op } = require("sequelize");
const CreateFilter = require("../scripts/filter");

const includeAll = [
  {
    model: UserModel,
    as: "executor",
    attributes: ["surname", "name", "patronymic"],
  },
  {
    model: UserModel,
    as: "creator",
    attributes: ["surname", "name", "patronymic"],
  },
  { model: CategoryModel, attributes: ["name"] },
  { model: StatusModel },
  { model: WayModel, attributes: ["name"] },
  { model: PriorityModel, attributes: ["name", "type"] },
];

const includeOne = [
  {
    model: UserModel,
    as: "executor",
    attributes: ["surname", "name", "patronymic"],
    include: [{ model: OrganizationModel }],
  },
  {
    model: UserModel,
    as: "creator",
    attributes: ["surname", "name", "patronymic", "subdivision", "position", "cabinet", "address", "phone", "phoneWork", "email"],
    include: [
      {
        model: OrganizationModel,
      },
    ],
  },
  { model: StatusModel },
  { model: CategoryModel },
  { model: PriorityModel },
  { model: WayModel },
];

class Controller {
  async create(req, res, next) {
    try {
      const { category, creatorId } = req.body;
      const system = await SystemModel.findOne();
      const creator = await UserModel.findOne({
        where: { id: creatorId },
        attributes: ["organizationId"],
      });

      let organizationId = creator.organizationId;

      const wayId = category.wayId;
      let step = await StepModel.findOne({
        where: { wayId: wayId, organizationId, stepNumber: 0 },
      });

      if (!step) {
        const headOrg = await OrganizationModel.findOne({
          where: { isHead: true },
        });
        organizationId = headOrg.id;
        step = await StepModel.findOne({
          where: { wayId: wayId, organizationId, stepNumber: 0 },
        });
      }

      if (system.openId) {
        req.body.statusId = system.openId;
        req.body.wayId = category.wayId;
        req.body.executorId = step.userId;
        req.body.organizationId = organizationId;
        req.body.priorityId = category.priorityId;

        await Model.create(req.body);
        res.json({ message: "Заявка создана!" });
      } else {
        throw "Не заданы статусы по-умолчанию";
      }
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, error) {
    try {
      const items = await Model.findAll({
        order: [["createdAt", "DESC"]],
        include: includeAll,
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const { page, limit, creatorId, executorId, categoryId, priorityId, statusId, wayId } = req.query;

      const offset = +page * +limit;

      const filter = CreateFilter({
        creatorId,
        executorId,
        categoryId,
        priorityId,
        statusId,
        wayId,
      });

      const tickets = await Model.findAndCountAll({
        where: filter,
        limit: limit,
        offset: offset,
        order: [["createdAt", "DESC"]],
        include: includeAll,
      });

      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const item = await Model.findOne({
        where: { id: id },
        include: includeOne,
      });
      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async getByStatus(req, res, next) {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const offset = +page * +limit;
      const system = await SystemModel.findOne();

      let where = {};

      if (req._parsedUrl.pathname == "/openedtickets") {
        where = { statusId: { [Op.notIn]: [system.closeId, system.rejectId] } };
      }

      if (req._parsedUrl.pathname == "/closedtickets") {
        where = { statusId: [system.closeId, system.rejectId] };
      }

      const tickets = await Model.findAndCountAll({
        where,
        limit: limit,
        offset: offset,
        order: [["createdAt", "DESC"]],
        include: includeAll,
      });

      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const userId = req.params.userId;

      const page = req.query.page;
      const limit = req.query.limit;
      const offset = page * limit;

      const system = await SystemModel.findOne();

      const items = await Model.findAndCountAll({
        where: {
          [Op.or]: [{ creatorId: userId }, { executorId: userId }],
          statusId: { [Op.notIn]: [system.closeId, system.rejectId] },
        },
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
        include: includeAll,
      });

      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const { id, name, surname } = req.body;
    const items = await Model.update({ name, surname }, { where: { id } });
    res.json(items);
  }

  async nextstep(req, res, next) {
    try {
      const { id, wayId, stepNumber, creatorId, organizationId } = req.body;
      const nextNumber = +stepNumber + 1;
      const step = await StepModel.findOne({
        where: {
          wayId,
          stepNumber: nextNumber,
          organizationId,
        },
        include: [{ model: UserModel, attributes: ["surname", "name", "patronymic"] }],
      });

      if (step) {
        const nextExecutor = step.user;
        const userId = step.dataValues.userId;
        const text = `Заявка передана следующему сотруднику - ${nextExecutor.surname} ${nextExecutor.name} ${nextExecutor.patronymic}`;
        await Model.update({ executorId: userId, stepNumber: nextNumber }, { where: { id } });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text,
          type: "reasign",
        });
        res.json({ message: text });
      } else {
        res.status(400).json({
          message: "Невозможно передать сотруднику из-за отсутствия шага выполнения",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async previousstep(req, res, next) {
    try {
      const { id, wayId, stepNumber, creatorId, organizationId } = req.body;
      const previousNumber = +stepNumber - 1;
      const step = await StepModel.findOne({
        where: {
          wayId,
          stepNumber: previousNumber,
          organizationId,
        },
        include: [{ model: UserModel, attributes: ["surname", "name", "patronymic"] }],
      });

      if (step) {
        const nextExecutor = step.user;
        const userId = step.dataValues.userId;
        const text = `Заявка передана следующему сотруднику - ${nextExecutor.surname} ${nextExecutor.name} ${nextExecutor.patronymic}`;
        await Model.update({ executorId: userId, stepNumber: previousNumber }, { where: { id } });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text,
          type: "reasign",
        });
        res.json({ message: text });
      } else {
        res.status(400).json({
          message: "Невозможно передать сотруднику из-за отсутствия шага выполнения",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async close(req, res, next) {
    try {
      const { type, creatorId, text } = req.body;
      const id = req.params.id;
      const system = await SystemModel.findOne();

      if (type == "close") {
        await Model.update({ statusId: system.closeId }, { where: { id } });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text: "Заявка закрыта.",
          type: "answer",
        });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text,
          type: "answer",
        });
      }

      if (type == "reject") {
        await Model.update({ statusId: system.rejectId }, { where: { id } });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text: "Заявка отклонена.",
          type: "answer",
        });
        await MessageModel.create({
          ticketId: id,
          creatorId,
          text,
          type: "answer",
        });
      }

      res.json({ message: "Заявка закрыта." });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const items = await Model.destroy({ where: { id: id } });
      res.json({ message: "Заявка удалена" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
