const { DataTypes } = require("sequelize");
const db = require("../../db");

const Area = db.define(
  "areas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    tree: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = Area;
