import { DomainEvent, UniqueEntityID } from '../../core/domain'

export interface EventStoreAggregate {
  pendingEvents: readonly DomainEvent[]
  lastUpdatedOn?: Date
  id: UniqueEntityID
}
