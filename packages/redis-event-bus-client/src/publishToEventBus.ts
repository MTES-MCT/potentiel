import { Redis } from 'ioredis';

export const publishToEventBus =
  (redis: Redis) => async (key: string, value: Record<string, unknown>) => {
    const streamName = process.env.REDIS_EVENT_BUS_STREAM_NAME || '';
    const streamMaxLength = process.env.REDIS_EVENT_BUS_MAX_LENGTH || 10000;

    const redisClient = redis.duplicate();

    redisClient.xadd(streamName, '*', key, JSON.stringify(value));
    redisClient.xtrim(streamName, 'MAXLEN', streamMaxLength);
    await redisClient.quit();
  };
