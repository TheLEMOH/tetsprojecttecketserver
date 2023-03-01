const { DataTypes } = require("sequelize");
const db = require("../../db");

/* const UserModel = require('./user') */
const OrganizationModel = require("./organization");

const Way = db.define(
  "ways",
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
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Way.belongsToMany(OrganizationModel, { through: "waysorganizations" });
OrganizationModel.belongsToMany(Way, { through: "waysorganizations" });

module.exports = Way;
