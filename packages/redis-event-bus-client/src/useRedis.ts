import redis from 'ioredis';

let redisClient: redis.Redis;

export const useRedis = async (callback: (redisClient: redis.Redis) => Promise<void>) => {
  if (!redisClient) {
    redisClient = new redis(process.env.REDIS_URL, {
      showFriendlyErrorStack: true,
      lazyConnect: true,
    });

    redisClient.connect().catch((error) => {
      throw error;
    });
  }

  const duplicatedRedisClient = redisClient.duplicate();
  await callback(duplicatedRedisClient);
  await duplicatedRedisClient.quit();
};
