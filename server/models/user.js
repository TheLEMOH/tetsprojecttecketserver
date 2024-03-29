const { DataTypes } = require("sequelize");
const db = require("../../db");

const OrganizationModel = require("./organization");
const RoleModel = require("./role");
const AreaModel = require("./area");

const bcrypt = require("bcrypt");
const salt = 3;

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const hashPassword = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hashPassword);
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: OrganizationModel,
        key: "id",
      },
    },
    subdivision: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    cabinet: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.STRING,
    },
    phoneWork: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: RoleModel,
        key: "id",
      },
    },
    foldersId: { type: DataTypes.ARRAY(DataTypes.UUID) },
    areasId: { type: DataTypes.ARRAY(DataTypes.UUID) },
    isEmployee: {
      type: DataTypes.BOOLEAN,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

User.belongsTo(OrganizationModel);
User.belongsTo(RoleModel);
User.belongsToMany(AreaModel, { through: "usersareas" });

OrganizationModel.hasMany(User);
RoleModel.hasMany(User);
AreaModel.belongsToMany(User, { through: "usersareas" });

/* const Model = withCache(User); */

module.exports = User;
