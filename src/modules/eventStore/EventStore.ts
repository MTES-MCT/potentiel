import { ResultAsync } from '../../core/utils'
import { DomainEvent } from '../../core/domain'
import { InfraNotAvailableError } from '../shared'
import { EventBus } from './EventBus'
import { StoredEvent } from './StoredEvent'

export interface EventStoreHistoryFilters {
  eventType?: StoredEvent['type'] | StoredEvent['type'][]
  requestId?: DomainEvent['requestId']
  aggregateId?: DomainEvent['aggregateId']
  payload?: Record<string, any>
}

export type EventStoreTransactionArgs = {
  loadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<StoredEvent[], InfraNotAvailableError>
  publish: (event: StoredEvent) => void
}

export type EventStore = EventBus & {
  transaction: <T>(
    fn: (args: EventStoreTransactionArgs) => T
  ) => ResultAsync<T, InfraNotAvailableError>
}
