import { DomainEvent, EventBus } from '../../core/domain'
import { wrapInfra } from '../../core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import { Redis } from 'ioredis'

type MakeRedisEventBusDeps = {
  redis: Redis
  streamName: string
}

export const makeRedisEventBus = (deps: MakeRedisEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      const { redis, streamName } = deps
      const redisClient = redis.duplicate()
      const message = toRedisMessage(event)

      return wrapInfra(redisClient.xadd(streamName, '*', event.type, JSON.stringify(message))).map(
        async () => {
          await redisClient.quit()
          return null
        }
      )
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
