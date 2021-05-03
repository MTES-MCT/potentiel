import { ResultAsync } from '../../core/utils'
import { DomainEvent } from '../../core/domain'
import { InfraNotAvailableError } from '../shared'
import { EventBus } from './EventBus'

export interface EventStoreHistoryFilters {
  eventType?: DomainEvent['type'] | DomainEvent['type'][]
  requestId?: DomainEvent['requestId']
  aggregateId?: string
  payload?: Record<string, any>
}

export type EventStoreTransactionArgs = {
  loadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
  publish: (event: DomainEvent) => void
}

export type EventStore = EventBus & {
  transaction: <T>(
    fn: (args: EventStoreTransactionArgs) => T
  ) => ResultAsync<T, InfraNotAvailableError>
}
