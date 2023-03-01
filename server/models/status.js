const { DataTypes } = require("sequelize");
const db = require("../../db");
const { statusesDefault } = require("../config");

const Status = db.define(
  "statuses",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
    },

    nameForInternalUsers: {
      type: DataTypes.STRING,
    },

    nameForExternalUsers: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Status.afterSync(async () => {
  const statuses = await Status.findAll();

  if (statuses.length == 0) {
    Status.bulkCreate(statusesDefault);
    console.log("Статусы созданы");
  }
});

module.exports = Status;
