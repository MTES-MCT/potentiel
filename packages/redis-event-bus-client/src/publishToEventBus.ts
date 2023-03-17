import { useRedis } from './useRedis';

export const publishToEventBus = async (key: string, value: Record<string, unknown>) => {
  const streamName = process.env.REDIS_EVENT_BUS_STREAM_NAME || '';
  const streamMaxLength = process.env.REDIS_EVENT_BUS_MAX_LENGTH || 10000;

  await useRedis(async (redisClient) => {
    await redisClient.xadd(streamName, '*', key, JSON.stringify(value));
    await redisClient.xtrim(streamName, 'MAXLEN', streamMaxLength);
  });
};
