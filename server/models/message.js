const { DataTypes } = require("sequelize");
const db = require("../../db");
const TicketModel = require("./ticket");
const UserModel = require("./user");
const Message = db.define(
  "messages",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    ticketId: {
      type: DataTypes.UUID,
      references: {
        model: TicketModel,
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "message",
      allowNull: false,
    },
  },
  {
    sequelize: db,
  }
);

Message.belongsTo(TicketModel);
Message.belongsTo(UserModel, { as: "creator" });

module.exports = Message;
