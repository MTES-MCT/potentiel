import Redis from 'ioredis';
import { publishToEventBus } from './publishToEventBus';

const streamName = 'potentiel_event_bus';
const redis = new Redis(6380);

describe('redisPublish', () => {
  beforeEach(async () => {
    await redis.del(streamName);
    process.env.REDIS_URL = 'redis://localhost:6380';
    process.env.REDIS_EVENT_BUS_STREAM_NAME = streamName;
  });

  afterAll(async () => {
    await redis.quit();
  });

  describe('when publishing an value', () => {
    it('the published event should be in the stream', async () => {
      const key = 'a key';
      const value = {
        test: 'this a test value',
      };

      await publishToEventBus(redis)(key, value);

      const results = await redis.xread('STREAMS', streamName, '0');

      const [actualStreamName, actualEntries] = results[0];
      expect(actualStreamName).toEqual(streamName);
      expect(actualEntries).toHaveLength(1);

      const [actualEntryId, [actualKey, actualValue]] = actualEntries[0];

      expect(actualKey).not.toBeNull();
      expect(actualKey).toEqual(key);

      const expectedValue = JSON.stringify(value);
      expect(actualValue).toEqual(expectedValue);
    });
  });
});
