const Model = require("../models/node");

class Controller {
  async create(req, res) {
    await Model.create(req.body);
    res.json(true);
  }

  async get(req, res) {
    const items = await Model.findAll();
    res.json(items);
  }

  async getOne(req, res) {
    const id = req.params.id;
    const item = await Model.findAll({ where: { nodeId: id } });
    res.json(item);
  }

  async update(req, res) {
    const { id, name, surname } = req.body;
    const items = await Model.update({ name, surname }, { where: { id: id } });
    res.json(items);
  }

  async delete(req, res) {
    const id = req.params.id;
    const items = await Model.destroy({ where: { id: id } });
    res.json(items);
  }
}

module.exports = new Controller();
