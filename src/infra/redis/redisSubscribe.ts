import { Redis } from 'ioredis'
import { logger } from '@core/utils'
import { HasSubscribe } from '../sequelize/helpers/Projection'
import { fromRedisMessage } from './helpers/fromRedisMessage'

type MakeRedisSubscribeDeps = {
  redis: Redis
  streamName: string
}

type RedisSubscribe = HasSubscribe['subscribe']

const makeRedisSubscribe = ({ redis, streamName }: MakeRedisSubscribeDeps): RedisSubscribe => {
  const subscribedConsumers: string[] = []

  return async (callback, consumerName) => {
    if (subscribedConsumers.find((c) => c === consumerName)) {
      return
    } else {
      subscribedConsumers.push(consumerName)
    }

    const redisClient = redis.duplicate()
    const groupName = await createConsumerGroup(redisClient, streamName, consumerName)

    const handleMessage = async (message: [string, string[]]) => {
      const [, messageValue] = message
      const [, eventValue] = messageValue
      const actualEventValue = JSON.parse(eventValue)
      const event = fromRedisMessage(actualEventValue)

      await callback(event)
    }

    const listenForMessage = async () => {
      const messageToHandle = await getNextMessageToHandle(
        redis,
        streamName,
        groupName,
        consumerName
      )

      if (messageToHandle) {
        try {
          await handleMessage(messageToHandle)
        } catch (error) {
          const [, messageValue] = messageToHandle
          const [eventType] = messageValue
          logger.error(
            `An error occured while handling the event ${eventType} with consumer ${consumerName}`
          )
          logger.error(error)

          await redis.xadd(`${consumerName}-DLQ`, '*', messageValue)
        }

        const [messageId] = messageToHandle
        await redisClient.xack(streamName, groupName, messageId)

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
    const newRedis = redis.duplicate()
    const newStreamMessages = await newRedis.xreadgroup(
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

    newRedis.disconnect()

    const [, newMessages] = newStreamMessages[0]
    return newMessages.length ? newMessages[0] : null
  } catch (error) {
    return null
  }
}

export { makeRedisSubscribe }
