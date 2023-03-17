import { publishToEventBus } from './publishToEventBus';
import { useRedis } from './useRedis';

const streamName = 'potentiel_event_bus';

describe('redisPublish', () => {
  process.env.REDIS_URL = 'redis://localhost:6380';
  process.env.REDIS_EVENT_BUS_STREAM_NAME = streamName;

  beforeEach(async () => {
    await useRedis(async (redisClient) => {
      await redisClient.del(streamName);
    });
  });

  describe('when publishing an value', () => {
    it('the published event should be in the stream', async () => {
      const key = 'a key';
      const value = {
        test: 'this a test value',
      };

      await publishToEventBus(key, value);

      let results: [string, [string, string[]][]][];
      await useRedis(async (redisClient) => {
        results = await redisClient.xread('STREAMS', streamName, '0');
      });

      const [actualStreamName, actualEntries] = results![0];
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
