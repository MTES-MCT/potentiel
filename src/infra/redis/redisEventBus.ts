import { DomainEvent, EventBus } from '../../core/domain'
import { wrapInfra } from '../../core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import { Redis } from 'ioredis'

type MakeRedisEventBusDeps = {
  redis: Redis
}

export const makeRedisEventBus = (deps: MakeRedisEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      const redisClient = deps.redis.duplicate()
      const message = toRedisMessage(event)

      return wrapInfra(
        redisClient.xadd('potentiel_event_bus', '*', event.type, JSON.stringify(message))
      ).map(async () => {
        await redisClient.quit()
        return null
      })
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
