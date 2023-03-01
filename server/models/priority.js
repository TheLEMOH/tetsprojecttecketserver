const { DataTypes } = require("sequelize");
const db = require("../../db");

const prioritiesDefault = [
  { name: "Низкий", type: "success" },
  { name: "Средний", type: "info" },
  { name: "Высокий", type: "warning" },
  { name: "Экстремальный", type: "danger" },
];

const Priority = db.define(
  "priorities",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

Priority.afterSync(async () => {
  const priorities = await Priority.findAll();

  if (priorities.length == 0) {
    Priority.bulkCreate(prioritiesDefault);
    console.log("Приоритеты созданы");
  }
});

module.exports = Priority;
