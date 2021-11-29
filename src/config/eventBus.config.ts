import { makeDualEventBus } from '../infra/dualEventBus'
import { makeInMemoryEventBus } from '../infra/inMemoryEventBus'
import { makeRedisEventBus } from '../infra/redis'
import Redis from 'ioredis'

const { REDIS_PORT, REDIS_HOST } = process.env

if (!REDIS_PORT || !REDIS_HOST) {
  console.error('Missing REDIS_PORT and/or REDIS_HOST env variables. Aborting.')
  process.exit(1)
}

const port = Number(REDIS_PORT)
const redis = new Redis({ port, host: REDIS_HOST })

export const eventBus = makeDualEventBus({
  inMemoryEventBus: makeInMemoryEventBus(),
  redisEventBus: makeRedisEventBus({ redis }),
})
