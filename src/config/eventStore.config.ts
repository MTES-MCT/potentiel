import { EventStore } from '../core/domain'
import { makeEventStore } from '../core/utils'
import { makeDualEventBus } from '../infra/dualEventBus'
import { makeInMemoryEventBus } from '../infra/inMemoryEventBus'
import {
  loadAggregateEventsFromStore,
  persistEventsToStore,
  rollbackEventsFromStore,
} from '../infra/sequelize'
import { makeRedisEventBus } from '../infra/redis'
import Redis from 'ioredis'

console.log(`EventStore will be using Sequelize for the event store and an in-memory event bus`)

const eventBus = makeDualEventBus({
  inMemoryEventBus: makeInMemoryEventBus(),
  redisEventBus: makeRedisEventBus(),
})

export const eventStore: EventStore = makeEventStore({
  loadAggregateEventsFromStore,
  persistEventsToStore,
  rollbackEventsFromStore,
  publishToEventBus: eventBus.publish.bind(eventBus),
  subscribe: eventBus.subscribe.bind(eventBus),
})
