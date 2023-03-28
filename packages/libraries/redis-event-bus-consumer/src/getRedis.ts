import redis from 'ioredis';

let redisClient: redis.Redis | undefined;

export const getRedis = async () => {
  if (!redisClient) {
    redisClient = new redis(process.env.REDIS_URL, {
      showFriendlyErrorStack: true,
      lazyConnect: true,
    });

    await redisClient.connect();
  }

  return redisClient;
};

export const disconnectRedis = async () => {
  await redisClient?.disconnect();
  redisClient = undefined;
};
