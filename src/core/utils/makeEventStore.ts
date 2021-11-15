import { okAsync } from 'neverthrow'
import { Constructor } from 'runtypes/lib/types/instanceof'
import { InfraNotAvailableError } from '../../modules/shared'
import { DomainEvent, EventStore, EventStoreTransactionArgs } from '../domain'
import { ResultAsync } from './Result'

interface MakeEventStoreDeps {
  loadAggregateEventsFromStore: (
    aggregateId: string
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
  persistEventsToStore: (events: DomainEvent[]) => ResultAsync<null, InfraNotAvailableError>
  emitEvent: (event: DomainEvent) => ResultAsync<null, InfraNotAvailableError>
  listenToEvents: (
    eventClass: Constructor<DomainEvent>,
    cb: (event: DomainEvent) => unknown
  ) => ResultAsync<null, InfraNotAvailableError>
}

export const makeEventStore = (deps: MakeEventStoreDeps): EventStore => {
  const { loadAggregateEventsFromStore, persistEventsToStore, emitEvent, listenToEvents } = deps

  const publish = (event: DomainEvent) => {
    return persistEventsToStore([event]).andThen(() => emitEvent(event))
  }
  const subscribe = (eventType, callback) => {}
  const transaction = <T>(fn: (args: EventStoreTransactionArgs) => T) =>
    okAsync<T, InfraNotAvailableError>(
      fn({
        loadHistory: (aggregateId: string) => okAsync<DomainEvent[], InfraNotAvailableError>([]),
        publish: (event: DomainEvent) => {},
      })
    )

  return { publish, subscribe, transaction }
}
