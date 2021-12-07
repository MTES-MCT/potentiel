import { Redis } from 'ioredis'
import { HasSubscribe, logger } from '../../core/utils'
import { fromRedisMessage } from './helpers/fromRedisMessage'

type MakeRedisSubscribeDeps = {
  redis: Redis
  streamName: string
}

type RedisSubscribe = HasSubscribe['subscribe']

const makeRedisSubscribe = ({ redis, streamName }: MakeRedisSubscribeDeps): RedisSubscribe => {
  const subscribedConsumers: string[] = []

  const removeConsumerFromSubscribed = (consumerName: string) => {
    const index = subscribedConsumers.indexOf(consumerName)
    index > -1 && subscribedConsumers.splice(index, 1)
  }

  return async (callback, consumerName) => {
    if (subscribedConsumers.find((c) => c === consumerName)) {
      return
    } else {
      subscribedConsumers.push(consumerName)
    }

    const redisClient = redis.duplicate()
    const groupName = await createConsumerGroup(redisClient, streamName, consumerName)

    const handleMessage = async (message: [string, string[]]) => {
      const [messageId, messageValue] = message
      const [eventType, eventValue] = messageValue
      const actualEventValue = JSON.parse(eventValue)
      const event = fromRedisMessage(actualEventValue)

      if (event) {
        try {
          callback(event)
          redisClient.xack(streamName, groupName, messageId)
        } catch {
          logger.error(
            `An error occured while handling the event ${eventType} with consumer ${consumerName}`
          )
        }
      }
    }

    const listenForMessage = async () => {
      const newRedis = redis.duplicate()
      const messageToHandle = await getNextMessageToHandle(
        newRedis,
        streamName,
        groupName,
        consumerName
      )

      if (isDisconnected(newRedis)) {
        removeConsumerFromSubscribed(consumerName)
        return
      }

      if (messageToHandle) {
        handleMessage(messageToHandle)
        listenForMessage()
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

const getNextMessageToHandle = async (
  redis: Redis,
  streamName: string,
  groupName: string,
  consumerName: string
) => {
  const pendingMessage = await getNextPendingMessage(redis, streamName, groupName, consumerName)
  const messageToHandle =
    pendingMessage ?? (await getNewMessage(redis, streamName, groupName, consumerName))
  return messageToHandle
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
  } catch (error) {
    return null
  }
}

const isDisconnected = (redis: Redis) => {
  return redis.status === 'end'
}

export { makeRedisSubscribe }
