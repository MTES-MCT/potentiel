import { ResultAsync } from '../utils'
import { DomainEvent } from './DomainEvent'
import { InfraNotAvailableError } from '../../modules/shared'
import { EventBus } from './EventBus'

export type EventStoreTransactionArgs = {
  loadHistory: (aggregateId: string) => ResultAsync<DomainEvent[], InfraNotAvailableError>
  publish: (event: DomainEvent) => void
}

export type EventStore = EventBus & {
  transaction: <T>(
    fn: (args: EventStoreTransactionArgs) => T
  ) => ResultAsync<T, InfraNotAvailableError>
}
