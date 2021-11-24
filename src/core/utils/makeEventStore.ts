import { Queue } from './Queue'
import { wrapInfra } from './wrapInfra'
import { InfraNotAvailableError, OtherError } from '../../modules/shared'
import { DomainEvent, EventBus, EventStore } from '../domain'
import { combine, ResultAsync, Result, unwrapResultOfResult, ok } from './Result'

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

  // Temporary solution to concurrency (ie global lock, to be replaced with aggregateId-level lock)
  const publishQueue = new Queue()

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
    transaction: <T>(callback): ResultAsync<T, InfraNotAvailableError> => {
      const ticket: Promise<Result<T, InfraNotAvailableError>> = publishQueue.push(async () => {
        const eventsToEmit: DomainEvent[] = []
        return callback({
          loadHistory: (aggregateId: string) => {
            return loadAggregateEventsFromStore(aggregateId)
          },
          publish: (event: DomainEvent) => {
            eventsToEmit.push(event)
          },
        }).andThen((res) => {
          return (eventsToEmit.length ? publishEventsBatch(eventsToEmit) : ok(null)).map(() => res)
        })
      })

      return wrapInfra(ticket).andThen(unwrapResultOfResult)
    },
  }
}
