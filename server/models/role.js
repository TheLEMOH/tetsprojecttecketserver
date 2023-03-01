const { DataTypes } = require("sequelize");
const db = require("../../db");

const rolesDefault = [
  { name: "Пользователь", level: 1 },
  { name: "Диспетчер", level: 2 },
  { name: "Исполнитель", level: 3 },
  { name: "Администратор", level: 4 },
];

const Role = db.define("roles", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  level: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
});

Role.afterSync(async () => {
  const statuses = await Role.findAll();

  if (statuses.length == 0) {
    Role.bulkCreate(rolesDefault);
    console.log("Роли созданы");
  }
});

module.exports = Role;
