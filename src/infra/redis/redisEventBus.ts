import { DomainEvent, EventBus } from '../../core/domain'
import { wrapInfra } from '../../core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import Redis from 'ioredis'

export const makeRedisEventBus = (): EventBus => {
  return {
    publish: (event) => {
      const redisClient = new Redis(process.env.REDIS_PORT)
      const message = toRedisMessage(event)

      return wrapInfra(
        redisClient.xadd('potentiel_event_bus', '*', event.type, JSON.stringify(message))
      ).map(() => {
        redisClient.disconnect()
        return null
      })
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
