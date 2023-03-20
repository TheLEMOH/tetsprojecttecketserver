const TicketModel = require("../models/ticket");
const SystemModel = require("../models/system");
const UserModel = require("../models/user");
const FolderModel = require("../models/folder");

const { Op } = require("sequelize");

const GetStatistic = async (system, name = "Заявки", filter = {}) => {
  const all = await TicketModel.count({ where: filter });
  const open = await TicketModel.count({
    where: { ...filter, statusId: { [Op.notIn]: [system.closeId, system.rejectId] } },
  });
  const close = await TicketModel.count({
    where: { ...filter, statusId: [system.closeId, system.rejectId] },
  });

  const beginDay = new Date();
  const endDay = new Date();

  beginDay.setUTCHours(0, 0, 0, 0);
  endDay.setUTCHours(23, 59, 59, 999);

  const allDay = await TicketModel.count({
    where: { ...filter, createdAt: { [Op.between]: [beginDay, endDay] } },
  });
  const openDay = await TicketModel.count({
    where: {
      ...filter,
      createdAt: { [Op.between]: [beginDay, endDay] },
      statusId: { [Op.notIn]: [system.closeId, system.rejectId] },
    },
  });
  const closeDay = await TicketModel.count({
    where: {
      ...filter,
      createdAt: { [Op.between]: [beginDay, endDay] },
      statusId: [system.closeId, system.rejectId],
    },
  });

  const beginHour = new Date();
  const endHour = new Date();

  beginHour.setHours(beginHour.getHours() - 1);

  const allHour = await TicketModel.count({
    where: { ...filter, createdAt: { [Op.between]: [beginHour, endHour] } },
  });
  const openHour = await TicketModel.count({
    where: {
      ...filter,
      createdAt: { [Op.between]: [beginHour, endHour] },
      statusId: { [Op.notIn]: [system.closeId, system.rejectId] },
    },
  });
  const closeHour = await TicketModel.count({
    where: {
      ...filter,
      createdAt: { [Op.between]: [beginHour, endHour] },
      statusId: [system.closeId, system.rejectId],
    },
  });

  const filterOpenDay = {
    createdAt: [beginHour, endHour],
    statusId: [system.closeId, system.rejectId],
  };

  return {
    name: name,
    data: [
      {
        name: `${name} (всего)`,
        all: all,
        open: open,
        close: close,
      },
      {
        name: `${name} (за день)`,
        all: allDay,
        open: openDay,
        close: closeDay,
        filterOpenDay: filterOpenDay,
      },
      {
        name: `${name} (за час)`,
        all: allHour,
        open: openHour,
        close: closeHour,
      },
    ],
  };
};

class Controller {
  async get(req, res, next) {
    try {
      const { userId } = req.query;

      const system = await SystemModel.findOne();
      const user = await UserModel.findOne({ where: { id: userId }, attributes: ["foldersId"], include: [{ model: FolderModel }] });
      const folders = user.folders;
      const result = [];

      const staticstic = await GetStatistic(system);

      result.push(staticstic);

      for (let i = 0, length = folders.length; i < length; i++) {
        const staticsticFolder = await GetStatistic(system, folders[i].name, folders[i].filter);
        result.push(staticsticFolder);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
