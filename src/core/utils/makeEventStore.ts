import { InfraNotAvailableError } from '../../modules/shared'
import { DomainEvent, EventBus, EventStore } from '../domain'
import { combine, ResultAsync } from './Result'

export interface MakeEventStoreDeps {
  loadAggregateEventsFromStore: (
    aggregateId: string
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
  persistEventsToStore: (events: DomainEvent[]) => ResultAsync<null, InfraNotAvailableError>
  publishToEventBus: EventBus['publish']
  subscribe: EventBus['subscribe']
}

export const makeEventStore = (deps: MakeEventStoreDeps): EventStore => {
  const { loadAggregateEventsFromStore, persistEventsToStore, publishToEventBus, subscribe } = deps

  const publishEventsBatch = (events: DomainEvent[]) => {
    return persistEventsToStore(events)
      .andThen(() => combine(events.map((event) => publishToEventBus(event))))
      .map(() => null)
  }

  const publish = (event: DomainEvent) => {
    return publishEventsBatch([event])
  }

  return {
    publish,
    subscribe,
    transaction: (callback) => {
      const eventsToEmit: DomainEvent[] = []
      return callback({
        loadHistory: (aggregateId: string) => {
          return loadAggregateEventsFromStore(aggregateId)
        },
        publish: (event: DomainEvent) => {
          eventsToEmit.push(event)
        },
      }).andThen((res) => {
        return publishEventsBatch(eventsToEmit).map(() => res)
      })
    },
  }
}
