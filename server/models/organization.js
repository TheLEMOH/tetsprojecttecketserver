const { DataTypes } = require("sequelize");
const db = require("../../db");

const Organization = db.define(
  "organizations",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Введите короткое наименование организации",
        },
        notEmpty: {
          msg: "Введите короткое наименование организации",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Введите наименование организации",
        },
        notEmpty: {
          msg: "Введите наименование организации",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Введите адресс организации",
        },
        notEmpty: {
          msg: "Введите адресс организации",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    isHead: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = Organization;
