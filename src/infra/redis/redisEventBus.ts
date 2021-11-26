import { DomainEvent, EventBus } from '../../core/domain'
import { wrapInfra } from '../../core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import { Redis } from 'ioredis'

type MakeRedisEventBusDeps = {
  redisClient: Redis
}
export const makeRedisEventBus = (deps: MakeRedisEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      const { redisClient } = deps
      const message = toRedisMessage(event)

      return wrapInfra(
        redisClient.xadd('potentiel_event_bus', '*', event.type, JSON.stringify(message))
      ).map(() => null)
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
