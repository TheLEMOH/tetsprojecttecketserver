const Model = require("../models/message");
const StatusModel = require("../models/status");
const TicketModel = require("../models/ticket");
const UserModel = require("../models/user");

const { Op } = require("sequelize");

class Controller {
  async create(req, res, next) {
    try {
      const { type, ticketId, executorId, statusId, creatorId, text } = req.body;

      if (type == "reasign") {
        const executor = await UserModel.findOne({
          where: { id: executorId },
          attributes: ["surname", "name", "patronymic"],
        });
        const executorName = `${executor.surname} ${executor.name} ${executor.patronymic}`;
        const textRe = `Заявка переназначена на сотрудника "${executorName}".`;

        await TicketModel.update({ executorId, lastAnswer: new Date() }, { where: { id: ticketId } });
        await Model.create({ ticketId, creatorId, text: textRe, type });
        await Model.create({ ticketId, creatorId, text, type: "note" });
      }

      if (type == "status") {
        const status = await StatusModel.findOne({
          where: { id: statusId },
          attributes: ["name"],
        });
        const textRe = `Статус заявки изменен на "${status.name}".`;

        await TicketModel.update({ statusId, lastAnswer: new Date() }, { where: { id: ticketId } });
        await Model.create({ ticketId, creatorId, text: textRe, type });
        await Model.create({ ticketId, creatorId, text, type: "answer" });
      }

      if (type == "note") {
        await Model.create({ ticketId, creatorId, text, type });
      }

      if (type == "answer") {
        await TicketModel.update({ lastAnswer: new Date() }, { where: { id: ticketId } });
        await Model.create({ ticketId, creatorId, text, type });
      }

      res.json({ message: "Сообщение отправлено!" });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const ticketId = req.params.ticketId;
      const role = req.role;
      let items = [];

      if (role > 1)
        items = await Model.findAll({
          order: ["createdAt"],
          where: { ticketId },
          include: [{ model: UserModel, attributes: ["name"], as: "creator" }],
        });
      else
        items = await Model.findAll({
          order: ["createdAt"],
          where: { ticketId, type: { [Op.not]: ["note"] } },
          include: [{ model: UserModel, attributes: ["name"], as: "creator" }],
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

  async update(req, res) {
    const id = req.params.id;
    const items = await Model.update(req.body, { where: { id: id } });
    res.json(items);
  }

  async delete(req, res) {
    const id = req.params.id;
    const items = await Model.destroy({ where: { id: id } });
    res.json(items);
  }
}

module.exports = new Controller();
