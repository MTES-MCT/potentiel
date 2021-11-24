import { EventStore } from '../core/domain'
import { makeEventStore } from '../core/utils'
import { makeInMemoryEventBus } from '../infra/inMemoryEventBus'
import { loadAggregateEventsFromStore, persistEventsToStore } from '../infra/sequelize'

console.log(`EventStore will be using Sequelize for the event store and an in-memory event bus`)

const eventBus = makeInMemoryEventBus()

export const eventStore: EventStore = makeEventStore({
  loadAggregateEventsFromStore,
  persistEventsToStore,
  publishToEventBus: eventBus.publish.bind(eventBus),
  subscribe: eventBus.subscribe.bind(eventBus),
})
