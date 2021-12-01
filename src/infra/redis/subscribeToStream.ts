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
  return (callback, consumerName) => {
    const listenForMessage = async () => {
      const redisClient = redis.duplicate()
      const groupName = `${consumerName}-group`

      try {
        await redisClient.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM')
      } catch (error) {}

      try {
        const results = await redisClient.xreadgroup(
          'GROUP',
          groupName,
          consumerName,
          'block',
          0,
          'STREAMS',
          streamName,
          '>'
        )

        const [key, messages] = results[0]

        for (const message of messages) {
          const [messageKey, messageValue] = message
          const [eventType, eventValue] = messageValue
          const actualEventValue = JSON.parse(eventValue)
          const event = fromRedisMessage(actualEventValue)

          if (event) {
            await callback(event)
          }
        }

        await redisClient.quit()
        await listenForMessage()
      } catch (error) {}
    }

    listenForMessage()
  }
}

export { makeSubscribeToStream }
