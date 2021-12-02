import { makePublishEvent } from '../infra/dualEventBus'
import { makePublishInMemory } from '../infra/inMemoryEventBus'
import { makePublishInRedisEventBus } from '../infra/redis'
import Redis from 'ioredis'
import { isTestEnv } from './env.config'
import { EventEmitter } from 'stream'

let publishToEventBus
const eventEmitter = new EventEmitter()

if (isTestEnv) {
  publishToEventBus = () => makePublishInMemory({ eventEmitter })
  console.log(`EventBus will be using in-memory for the eventbus`)
} else {
  const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_EVENT_BUS_STREAM_NAME } = process.env

  if (!REDIS_PORT || !REDIS_HOST || !REDIS_EVENT_BUS_STREAM_NAME || !REDIS_PASSWORD) {
    console.error('Missing REDIS env variables. Aborting.')
    process.exit(1)
  }

  const redis = new Redis({
    port: Number(REDIS_PORT),
    host: REDIS_HOST,
    password: 'REDIS_PASSWORD',
    showFriendlyErrorStack: true,
    lazyConnect: true,
  })
  redis.connect().catch((error) => {
    console.error(`Can not connect to Redis server.`)
    throw error
  })

  console.log(`EventBus will be using both in-memory and redis for the eventbus`)

  publishToEventBus = () =>
    makePublishEvent({
      publishInRedisEventBus: makePublishInRedisEventBus({
        redis,
        streamName: REDIS_EVENT_BUS_STREAM_NAME,
      }),
      publishInMemory: makePublishInMemory({ eventEmitter }),
    })
}

export { publishToEventBus }
