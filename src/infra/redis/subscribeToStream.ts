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
        const pendingStreamMessages = await redisClient.xreadgroup(
          'GROUP',
          groupName,
          consumerName,
          'COUNT',
          '1',
          'STREAMS',
          streamName,
          '0'
        )
        const [key, pendingMessages] = pendingStreamMessages[0]

        if (pendingMessages.length) {
          const [messageId, messageValue] = pendingMessages[0]
          const [eventType, eventValue] = messageValue
          const actualEventValue = JSON.parse(eventValue)
          const event = fromRedisMessage(actualEventValue)

          if (event) {
            try {
              await callback(event)
              redisClient.xack(streamName, groupName, messageId)
            } catch (error) {}
          }
        } else {
          const newStreamMessages = await redisClient.xreadgroup(
            'GROUP',
            groupName,
            consumerName,
            'BLOCK',
            0,
            'COUNT',
            '1',
            'STREAMS',
            streamName,
            '>'
          )

          const [key, newMessages] = newStreamMessages[0]
          const [messageId, messageValue] = newMessages[0]
          const [eventType, eventValue] = messageValue
          const actualEventValue = JSON.parse(eventValue)
          const event = fromRedisMessage(actualEventValue)

          if (event) {
            try {
              await callback(event)
              redisClient.xack(streamName, groupName, messageId)
            } catch (error) {}
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
