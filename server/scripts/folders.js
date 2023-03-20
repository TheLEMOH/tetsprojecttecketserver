const { Op } = require("sequelize");

const CreateFilterForFolders = (obj) => {
  const filter = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v != "null"));

  const res = {};

  for (let i in filter) {
    res[i] = {};
    if (filter[i].in) {
      res[i][Op.in] = filter[i].in;
    }
  }

  return res;
};

module.exports = CreateFilterForFolders;
