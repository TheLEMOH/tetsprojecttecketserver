const TicketModel = require("../models/ticket");
const SystemModel = require("../models/system");

const { Op } = require("sequelize");

class Controller {
  async get(req, res, next) {
    try {
      const { userId } = req.body;

      const system = await SystemModel.findOne();

      const all = await TicketModel.count();
      const open = await TicketModel.count({
        where: { statusId: { [Op.notIn]: [system.closeId, system.rejectId] } },
      });
      const close = await TicketModel.count({
        where: { statusId: [system.closeId, system.rejectId] },
      });

      const beginDay = new Date();
      const endDay = new Date();

      beginDay.setUTCHours(0, 0, 0, 0);
      endDay.setUTCHours(23, 59, 59, 999);

      const allDay = await TicketModel.count({
        where: { createdAt: { [Op.between]: [beginDay, endDay] } },
      });
      const openDay = await TicketModel.count({
        where: {
          createdAt: { [Op.between]: [beginDay, endDay] },
          statusId: { [Op.notIn]: [system.closeId, system.rejectId] },
        },
      });
      const closeDay = await TicketModel.count({
        where: {
          createdAt: { [Op.between]: [beginDay, endDay] },
          statusId: [system.closeId, system.rejectId],
        },
      });

      const beginHour = new Date();
      const endHour = new Date();

      beginHour.setHours(beginHour.getHours() - 1);

      const allHour = await TicketModel.count({
        where: { createdAt: { [Op.between]: [beginHour, endHour] } },
      });
      const openHour = await TicketModel.count({
        where: {
          createdAt: { [Op.between]: [beginHour, endHour] },
          statusId: { [Op.notIn]: [system.closeId, system.rejectId] },
        },
      });
      const closeHour = await TicketModel.count({
        where: {
          createdAt: { [Op.between]: [beginHour, endHour] },
          statusId: [system.closeId, system.rejectId],
        },
      });

      res.json([
        {
          name: "Заявки (всего)",
          all: all,
          open: open,
          close: close,
        },
        {
          name: "Заявки (за день)",
          all: allDay,
          open: openDay,
          close: closeDay,
        },
        {
          name: "Заявки (за час)",
          all: allHour,
          open: openHour,
          close: closeHour,
        },
      ]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
