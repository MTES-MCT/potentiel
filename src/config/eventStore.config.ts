import { EventStore } from '../core/domain'
import { makeEventStore } from '../core/utils'
import {
  loadAggregateEventsFromStore,
  persistEventsToStore,
  rollbackEventsFromStore,
} from '../infra/sequelize'
import { eventBus } from './eventBus.config'

console.log(`EventStore will be using Sequelize for the event store`)

export const eventStore: EventStore = makeEventStore({
  loadAggregateEventsFromStore,
  persistEventsToStore,
  rollbackEventsFromStore,
  publishToEventBus: eventBus.publish.bind(eventBus),
  subscribe: eventBus.subscribe.bind(eventBus),
})
