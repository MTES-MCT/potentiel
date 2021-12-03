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

      async function createConsumerGroup() {
        const groupName = `${consumerName}-group`

        try {
          await redisClient.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM')
        } catch (error) {}
        return groupName
      }

      const handleEvent = async (message: [string, string[]]): Promise<void> => {
        const [messageId, messageValue] = message
        const [eventType, eventValue] = messageValue
        const actualEventValue = JSON.parse(eventValue)
        const event = fromRedisMessage(actualEventValue)

        if (event) {
          try {
            await callback(event)
            redisClient.xack(streamName, groupName, messageId)
          } finally {
            await listenForMessage()
          }
        }
      }

      const groupName = await createConsumerGroup()

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
        await handleEvent(pendingMessages[0])
      } else {
        try {
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
          await handleEvent(newMessages[0])
        } catch (error) {}
      }
    }

    listenForMessage()
  }
}

export { makeSubscribeToStream }
