import { DomainEvent } from '@core/domain'
import { wrapInfra } from '@core/utils'
import { toRedisMessage } from './helpers/toRedisMessage'
import { Redis } from 'ioredis'

type MakeRedisPublishDeps = {
  redis: Redis
  streamName: string
  streamMaxLength: number
}

export const makeRedisPublish =
  ({ redis, streamName, streamMaxLength }: MakeRedisPublishDeps) =>
  (event: DomainEvent) => {
    const redisClient = redis.duplicate()
    const message = toRedisMessage(event)

    return wrapInfra(redisClient.xadd(streamName, '*', event.type, JSON.stringify(message))).map(
      async () => {
        redisClient.xtrim(streamName, 'MAXLEN', streamMaxLength)
        await redisClient.quit()
        return null
      }
    )
  }
