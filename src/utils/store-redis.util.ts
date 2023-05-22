const Redis = require('ioredis');
const redis = new Redis();

const setRedis = async (key: string, value: string) => {
  await redis.set(key, value, 'EX', 5 * 60);
};

const getRedis = (key: string) => {
  return redis.get(key);
};

const deleteRedis = (key: string) => {
  return redis.del(key);
};

export { setRedis, getRedis, deleteRedis };
