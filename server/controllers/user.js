const Model = require("../models/user");
const OrganizationModel = require("../models/organization");
const SystemModel = require("../models/system");
const RoleModel = require("../models/role");

const CreateFilter = require("../scripts/filter");

const CheckEmail = async (userId, userEmail) => {
  const system = await SystemModel.findOne({ attributes: ["emails"] });
  const existUser = await Model.findOne({ where: { email: userEmail } });

  if (existUser && userId != existUser.id) throw "Почта уже используется";

  const emails = system.emails;
  let check = false;

  emails.forEach((e) => {
    check += userEmail.includes(e.name);
  });

  if (check) return true;
  else {
    throw "Используйте почту разрешенную в системе";
  }
};

class Controller {
  async create(req, res, next) {
    try {
      await CheckEmail(null, req.body.email);

      const { areasId } = req.body;

      const user = await Model.create(req.body);
      user.setAreas(areasId);
      res.json({ message: "Пользователь добавлен!" });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const items = await Model.findAll({
        order: ["surname", "name", "patronymic"],
        attributes: { exclude: ["password"] },
        include: [{ model: OrganizationModel }, { model: RoleModel }],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getPages(req, res, next) {
    try {
      const { page, limit, surname, name, patronimyc, organizationId, subdivision, position, email, roleId, isEmployee } = req.query;
      const offset = page * limit;
      const filter = CreateFilter({
        surname,
        name,
        patronimyc,
        organizationId,
        subdivision,
        position,
        email,
        roleId,
        isEmployee,
      });

      const items = await Model.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order: ["surname", "name", "patronymic"],
        attributes: { exclude: ["password"] },
        include: [{ model: OrganizationModel }, { model: RoleModel }],
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id;

      const clientId = req.clientId;
      const role = req.role;

      if (role < 2) {
        if (clientId != id) throw "Пользователь не имеет доступа";
      }

      const item = await Model.findOne({
        where: { id: id },
        attributes: { exclude: ["password"] },
      });

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async getEmployees(req, res, next) {
    try {
      const item = await Model.findAll({
        where: { isEmployee: true },
        order: ["surname", "name", "patronymic"],
        attributes: { exclude: ["password"] },
        include: [{ model: OrganizationModel, attributes: ["id", "shortName", "name"] }],
      });

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id, email, foldersId, areasId } = req.body;

      const clientId = req.clientId;
      const role = req.role;

      if (role < 2) {
        if (clientId != id) throw "Пользователь не имеет доступа";
      }

      await CheckEmail(id, email);

      const user = await Model.findByPk(id);

      user.setAreas(areasId);
      user.setFolders(foldersId);

      /*       await user.cache().update(req.body); */

      await Model.update(req.body, { where: { id: id } });

      res.json({ message: "Пользователь обновлен!" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await Model.destroy({ where: { id: id } });
      res.json({ message: "Пользователь удален!" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
