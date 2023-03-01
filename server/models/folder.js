const { DataTypes } = require("sequelize");
const db = require("../../db");

const UserModel = require("./user");

const Folder = db.define(
  "folders",
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
    filter: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Folder.belongsToMany(UserModel, { through: "foldersusers" });
UserModel.belongsToMany(Folder, { through: "foldersusers" });

module.exports = Folder;
