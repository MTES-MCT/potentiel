import { Redis } from 'ioredis'
import { HasSubscribe } from '../../core/utils'
import { fromRedisMessage } from './helpers/fromRedisMessage'

type MakeRedisSubscribeDeps = {
  redis: Redis
  streamName: string
}

type RedisSubscribe = HasSubscribe['subscribe']

const makeRedisSubscribe = ({ redis, streamName }: MakeRedisSubscribeDeps): RedisSubscribe => {
  return async (callback, consumerName) => {
    const listenForMessage = async () => {
      const redisClient = redis.duplicate()

      const handleEvent = async (message: [string, string[]]): Promise<void> => {
        const [messageId, messageValue] = message
        const [eventType, eventValue] = messageValue
        const actualEventValue = JSON.parse(eventValue)
        const event = fromRedisMessage(actualEventValue)

        if (event) {
          try {
            await callback(event)
            redisClient.xack(streamName, groupName, messageId)
          } catch {}
        }
      }

      const getNewMessage = async (
        streamName: string,
        consumerGroupName: string,
        consumerName: string
      ) => {
        try {
          const newStreamMessages = await redisClient.xreadgroup(
            'GROUP',
            consumerGroupName,
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

          return newMessages.length ? newMessages[0] : null
        } catch {
          return null
        }
      }

      const groupName = await createConsumerGroup(redisClient, streamName, consumerName)
      const pendingMessage = await getNextPendingMessage(
        redisClient,
        streamName,
        groupName,
        consumerName
      )
      const messageToHandle =
        pendingMessage ?? (await getNewMessage(streamName, groupName, consumerName))

      if (messageToHandle) {
        await handleEvent(messageToHandle)
        await listenForMessage()
      }
    }

    listenForMessage()
  }
}

const createConsumerGroup = async (redis: Redis, streamName: string, consumerName: string) => {
  const groupName = `${consumerName}-group`

  try {
    await redis.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM')
  } catch {}

  return groupName
}

const getNextPendingMessage = async (
  redis: Redis,
  streamName: string,
  consumerGroupName: string,
  consumerName: string
) => {
  const pendingStreamMessages = await redis.xreadgroup(
    'GROUP',
    consumerGroupName,
    consumerName,
    'COUNT',
    '1',
    'STREAMS',
    streamName,
    '0'
  )
  const [, pendingMessages] = pendingStreamMessages[0]
  return pendingMessages.length ? pendingMessages[0] : null
}

export { makeRedisSubscribe as makeSubscribeToStream }
