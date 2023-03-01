const { DataTypes } = require("sequelize");
const db = require("../../db");

const CategoryModel = require("./category");
const UserModel = require("./user");
const WayModel = require("./way");
const PriorityModel = require("./priority");
const StatusModel = require("./status");
const OrganizationModel = require("./organization");

const Ticket = db.define("tickets", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  organizationId: {
    type: DataTypes.UUID,
    references: {
      model: OrganizationModel,
      key: "id",
    },
  },

  creatorId: {
    type: DataTypes.UUID,
    references: {
      model: UserModel,
      key: "id",
    },
  },

  executorId: {
    type: DataTypes.UUID,
    references: {
      model: UserModel,
      key: "id",
    },
  },

  categoryId: {
    type: DataTypes.UUID,
    references: {
      model: CategoryModel,
      key: "id",
    },
  },

  fields: {
    type: DataTypes.JSON(),
  },

  text: {
    type: DataTypes.STRING,
  },

  stepNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  wayId: {
    type: DataTypes.UUID,
    references: {
      model: WayModel,
      key: "id",
    },
  },

  statusId: {
    type: DataTypes.UUID,
    references: {
      model: StatusModel,
      key: "id",
    },
  },

  priorityId: {
    type: DataTypes.UUID,
    references: {
      model: PriorityModel,
      key: "id",
    },
  },

  lastAnswer: {
    type: DataTypes.DATE,
  },
});

Ticket.belongsTo(UserModel, { as: "creator" });
Ticket.belongsTo(UserModel, { as: "executor" });
Ticket.belongsTo(WayModel);
Ticket.belongsTo(CategoryModel);
Ticket.belongsTo(StatusModel);
Ticket.belongsTo(PriorityModel);
Ticket.belongsTo(OrganizationModel);

UserModel.hasMany(Ticket);
WayModel.hasMany(Ticket);
CategoryModel.hasMany(Ticket);
StatusModel.hasMany(Ticket);
PriorityModel.hasMany(Ticket);
OrganizationModel.hasMany(Ticket);

module.exports = Ticket;
