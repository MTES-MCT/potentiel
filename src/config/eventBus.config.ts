import { makeDualPublish } from '@infra/dualEventBus';
import { makeInMemoryPublish, makeInMemorySubscribe } from '@infra/inMemoryEventBus';
import { makeRedisPublish, makeRedisSubscribe } from '@infra/redis';
import Redis from 'ioredis';
import { isTestEnv } from './env.config';
import { EventEmitter } from 'stream';
import { EventBus } from '@core/domain';
import { Subscribe } from '@infra/sequelize/projectionsNext';

const eventEmitter = new EventEmitter();
let publishToEventBus: EventBus['publish'];
let subscribeToRedis: Subscribe;

const subscribe = makeInMemorySubscribe({ eventEmitter });

if (isTestEnv) {
  publishToEventBus = makeInMemoryPublish({ eventEmitter });
  console.log(`EventBus will be using in-memory for the eventbus`);
} else {
  const {
    REDIS_URL,
    REDIS_EVENT_BUS_STREAM_NAME,
    REDIS_EVENT_BUS_MAX_LENGTH = 10000,
  } = process.env;

  const isScalingoConfigOk = REDIS_URL && REDIS_EVENT_BUS_STREAM_NAME;

  if (!isScalingoConfigOk) {
    console.error('Missing REDIS env variables. Aborting.');
    process.exit(1);
  }

  const redis = new Redis(REDIS_URL, { showFriendlyErrorStack: true, lazyConnect: true });
  redis.connect().catch((error) => {
    console.error(`Can not connect to Redis server.`);
    throw error;
  });

  console.log(`EventBus will be using both in-memory and redis for the eventbus`);

  publishToEventBus = makeDualPublish({
    redisPublish: makeRedisPublish({
      redis,
      streamName: REDIS_EVENT_BUS_STREAM_NAME,
      streamMaxLength: +REDIS_EVENT_BUS_MAX_LENGTH,
    }),
    inMemoryPublish: makeInMemoryPublish({ eventEmitter }),
  });

  subscribeToRedis = makeRedisSubscribe({ redis, streamName: REDIS_EVENT_BUS_STREAM_NAME });
}

export { publishToEventBus, subscribe, subscribeToRedis };
