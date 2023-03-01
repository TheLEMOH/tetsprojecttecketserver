const { DataTypes } = require("sequelize");
const db = require("../../db");

const StatusModel = require("./status");

const systemDefault = {
  openId: null,
  closeId: null,
  emails: [],
};

const System = db.define(
  "systems",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },

    openId: {
      type: DataTypes.UUID,
      references: {
        model: StatusModel,
        key: "id",
      },
    },

    closeId: {
      type: DataTypes.UUID,
      references: {
        model: StatusModel,
        key: "id",
      },
    },

    rejectId: {
      type: DataTypes.UUID,
      references: {
        model: StatusModel,
        key: "id",
      },
    },

    emails: {
      type: DataTypes.JSON,
    },
    
    init: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

System.afterSync(async () => {
  const systems = await System.findAll();

  if (systems.length == 0) {
    System.create(systemDefault);
    console.log("Системные настройки созданы");
  }
});

System.belongsTo(StatusModel, { as: "open" });
System.belongsTo(StatusModel, { as: "close" });
System.belongsTo(StatusModel, { as: "reject" });

StatusModel.hasMany(System);

module.exports = System;
