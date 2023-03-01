const { DataTypes } = require("sequelize");
const db = require("../../db");

const WayModel = require("./way");
const PriorityModel = require("./priority");

const Category = db.define(
  "categories",
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
    wayId: {
      type: DataTypes.UUID,
      references: {
        model: "ways",
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
    disabledEditor: {
      type: DataTypes.BOOLEAN,
    },
    fields: {
      type: DataTypes.JSON({
        id: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        type: { type: DataTypes.STRING },
        list: DataTypes.ARRAY({
          value: { type: DataTypes.STRING },
          label: { type: DataTypes.STRING },
        }),
      }),
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Category.belongsTo(WayModel);
Category.belongsTo(PriorityModel);

WayModel.hasMany(Category);
PriorityModel.hasMany(Category);

module.exports = Category;
