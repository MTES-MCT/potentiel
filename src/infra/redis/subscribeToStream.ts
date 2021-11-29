import { Redis } from 'ioredis'
import { DomainEvent } from '../../core/domain'
import { logger } from '../../core/utils'
import { fromRedisMessage } from './helpers/fromRedisMessage'

type MakeSubscribeToStreamDeps = {
  redis: Redis
  streamName: string
}

type SubscribeToStream = (callback: (event: DomainEvent) => unknown, consumerName: string) => void

const makeSubscribeToStream = ({
  redis,
  streamName,
}: MakeSubscribeToStreamDeps): SubscribeToStream => {
  return (callback, coonsumerName) => {
    const listenForMessage = async () => {
      const redisClient = redis.duplicate()

      try {
        const results = await redisClient.xread('block', 0, 'STREAMS', streamName, '$')
        const [key, messages] = results[0]
        const [messageKey, messageValue] = messages[0]
        const [eventType, eventValue] = messageValue
        const actualEventValue = JSON.parse(eventValue)
        const event = fromRedisMessage(actualEventValue)

        if (event) {
          await callback(event)
        }

        redisClient.quit()
        await listenForMessage()
      } catch (error) {
        logger.error(error)
      }
    }

    listenForMessage()
  }
}

export { makeSubscribeToStream }
