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
    const redisClient = redis.duplicate()
    const groupName = await createConsumerGroup(redisClient, streamName, consumerName)

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

    const listenForMessage = async () => {
      const pendingMessage = await getNextPendingMessage(
        redisClient,
        streamName,
        groupName,
        consumerName
      )
      const messageToHandle =
        pendingMessage ?? (await getNewMessage(redisClient, streamName, groupName, consumerName))

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

const getNewMessage = async (
  redis: Redis,
  streamName: string,
  consumerGroupName: string,
  consumerName: string
) => {
  try {
    const newStreamMessages = await redis.xreadgroup(
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

    const [, newMessages] = newStreamMessages[0]
    return newMessages.length ? newMessages[0] : null
  } catch {
    return null
  }
}

export { makeRedisSubscribe as makeSubscribeToStream }
