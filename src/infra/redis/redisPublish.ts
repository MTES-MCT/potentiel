import { DomainEvent } from '@core/domain'
import { wrapInfra } from '@core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import { Redis } from 'ioredis'

type MakeRedisPublishDeps = {
  redis: Redis
  streamName: string
}

export const makeRedisPublish = (deps: MakeRedisPublishDeps) => (event: DomainEvent) => {
  const { redis, streamName } = deps
  const redisClient = redis.duplicate()
  const message = toRedisMessage(event)

  return wrapInfra(redisClient.xadd(streamName, '*', event.type, JSON.stringify(message))).map(
    async () => {
      await redisClient.quit()
      return null
    }
  )
}
