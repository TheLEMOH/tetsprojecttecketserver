const Redis = require("ioredis");
const redis = new Redis();

const RedisAdaptor = require("sequelize-transparent-cache-ioredis");
const sequelizeCache = require("sequelize-transparent-cache");
const redisAdaptor = new RedisAdaptor({
  client: redis,
  namespace: "ticketsystem",
  lifetime: 60,
});

const { withCache } = sequelizeCache(redisAdaptor);

module.exports = withCache;
