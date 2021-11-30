import { makeDualEventBus } from '../infra/dualEventBus'
import { makeInMemoryEventBus } from '../infra/inMemoryEventBus'
import { makeRedisEventBus } from '../infra/redis'
import Redis from 'ioredis'

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_EVENT_BUS_STREAM_NAME } = process.env

if (!REDIS_PORT || !REDIS_HOST || !REDIS_EVENT_BUS_STREAM_NAME || !REDIS_PASSWORD) {
  console.error('Missing REDIS env variables. Aborting.')
  process.exit(1)
}

const port = Number(REDIS_PORT)
const redis = new Redis({ port, host: REDIS_HOST, password: REDIS_PASSWORD })

console.log(`EventBus will be using both in-memory and redis for the eventbus`)

export const eventBus = makeDualEventBus({
  inMemoryEventBus: makeInMemoryEventBus(),
  redisEventBus: makeRedisEventBus({ redis, streamName: REDIS_EVENT_BUS_STREAM_NAME }),
})
