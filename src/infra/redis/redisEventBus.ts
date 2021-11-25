import { DomainEvent, EventBus } from '../../core/domain'
import { wrapInfra } from '../../core/utils'
import { toRedisTuple } from './helpers/toRedisTuple'

type MakeRedisEventBusDeps = {
  redisClient: RedisClient
}
export const makeRedisEventBus = (deps: MakeRedisEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      const { redisClient } = deps
      const message = toRedisTuple(event)
      return wrapInfra(redisClient.XADD('potentiel_event_bus', '*', message)).map(() => null)
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
