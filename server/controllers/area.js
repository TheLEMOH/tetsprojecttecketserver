const AreaModel = require("../models/area");
const CreateFilter = require("../scripts/filter");
/* const NodeModel = require('../models/node') */

/* const RecurseCreate = async (tree, nodeId, areaId) => {
    for (let i = 0, length = tree.length; i < length; i++) {
        const node = await NodeModel.create({ key: tree[i].key, data: tree[i].data, nodeId, areaId })
        const values = node.dataValues
        const parentId = values.id
        if (tree[i].children.length != 0)
            await RecurseCreate(tree[i].children, parentId, null)
    }
}

const RecurseGet = async (nodeId, areaId) => {
    const nodes = await NodeModel.findAll({ where: { nodeId, areaId } })
    if (nodes) {
        for (let i = 0, length = nodes.length; i < length; i++) {
            const values = nodes[i].dataValues
            const nodeId = values.id
            const children = await RecurseGet(nodeId, null)
            nodes[i].dataValues.children = children
        }
        return nodes
    }
    else
        return null
} */

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
      next();
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
