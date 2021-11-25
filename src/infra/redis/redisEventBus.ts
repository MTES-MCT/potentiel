import { DomainEvent, EventBus } from '../../core/domain'
import { okAsync } from '../../core/utils'
import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>

type MakeRedisEventBusDeps = {
  redisClient: RedisClient
}

export const makeRedisEventBus = (deps: MakeRedisEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      return okAsync(null)
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
