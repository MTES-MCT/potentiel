import redis from 'ioredis';

let redisClient: redis.Redis;

export const useRedis = async (callback: (redisClient: redis.Redis) => Promise<void>) => {
  console.info(process.env.REDIS_URL);

  if (!redisClient) {
    redisClient = new redis(process.env.REDIS_URL, {
      showFriendlyErrorStack: true,
      lazyConnect: true,
    });

    redisClient.connect().catch((error) => {
      console.error(`Oups I did it again... <3`);
      throw error;
    });
  }

  const duplicatedRedisClient = redisClient.duplicate();
  await callback(duplicatedRedisClient);
  await duplicatedRedisClient.quit();
};
