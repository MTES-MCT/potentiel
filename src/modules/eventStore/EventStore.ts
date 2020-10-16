import { ResultAsync } from 'neverthrow'
import { DomainEvent } from '../../core/domain/DomainEvent'
import { InfraNotAvailableError, OtherError } from '../shared'
import { EventBus } from './EventBus'
import { StoredEvent } from './StoredEvent'

export interface EventStoreHistoryFilters {
  eventType?: StoredEvent['type'] | StoredEvent['type'][]
  requestId?: DomainEvent['requestId']
  aggregateId?: DomainEvent['aggregateId']
  payload?: Record<string, any>
}

export type EventStoreTransactionFn = (args: {
  loadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<StoredEvent[], InfraNotAvailableError>
  publish: (event: StoredEvent) => void
}) => any

export type EventStore = EventBus & {
  transaction: (
    fn: EventStoreTransactionFn
  ) => ResultAsync<ReturnType<typeof fn>, InfraNotAvailableError | OtherError>
}
