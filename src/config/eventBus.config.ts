import { makeDualEventBus } from '../infra/dualEventBus'
import { makeInMemoryEventBus } from '../infra/inMemoryEventBus'
import { makeRedisEventBus } from '../infra/redis'

const { REDIS_PORT, REDIS_HOST } = process.env

if (!REDIS_PORT || !REDIS_HOST) {
  console.error('Missing REDIS_PORT and/or REDIS_HOST env variables. Aborting.')
  process.exit(1)
}

export const eventBus = makeDualEventBus({
  inMemoryEventBus: makeInMemoryEventBus(),
  redisEventBus: makeRedisEventBus(),
})
