import { EventStore } from '../core/domain'
import { makeEventStore, okAsync } from '../core/utils'
import { loadAggregateEventsFromStore, persistEventsToStore } from '../infra/sequelize'

console.log(`EventStore will be using Sequelize for the event store`)

export const eventStore: EventStore = makeEventStore({
  loadAggregateEventsFromStore,
  persistEventsToStore,
  publishToEventBus: (event) => okAsync(null),
  subscribe: (eventType, callback) => okAsync(null),
})
