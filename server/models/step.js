const { DataTypes } = require("sequelize");
const db = require("../../db");

const UserModel = require("./user");
const WayModel = require("./way");
const OrganizationModel = require("./organization");

const Step = db.define(
  "steps",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },

    description: {
      type: DataTypes.STRING,
    },

    stepNumber: {
      type: DataTypes.INTEGER,
    },

    userId: {
      type: DataTypes.UUID,
      references: {
        model: UserModel,
        key: "id",
      },
    },

    wayId: {
      type: DataTypes.UUID,
      references: {
        model: WayModel,
        key: "id",
      },
    },

    organizationId: {
      type: DataTypes.UUID,
      references: {
        model: OrganizationModel,
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Step.belongsTo(WayModel, { onDelete: "CASCADE" });
Step.belongsTo(UserModel);
Step.belongsTo(OrganizationModel);

OrganizationModel.hasMany(Step);
WayModel.hasMany(Step);

module.exports = Step;
