const { DataTypes } = require("sequelize");
const db = require("../../db");

const AreaModel = require("./area");
const CategoryModel = require("./category");

const Node = db.define(
  "nodes",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },

    key: {
      type: DataTypes.STRING,
    },

    data: {
      type: DataTypes.JSON({
        key: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        type: {
          type: DataTypes.STRING,
        },
        categoryId: {
          type: DataTypes.INTEGER,
        },
      }),
    },

    areaId: {
      type: DataTypes.UUID,
      references: {
        model: AreaModel,
        key: "id",
      },
    },

    nodeId: {
      type: DataTypes.UUID,
      references: {
        model: "nodes",
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Node.belongsTo(AreaModel, { onDelete: "CASCADE" });

Node.hasMany(Node, { onDelete: "CASCADE" });

AreaModel.hasMany(Node);

module.exports = Node;
