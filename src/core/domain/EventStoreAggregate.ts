import { DomainEvent } from './DomainEvent'
import { UniqueEntityID } from './UniqueEntityID'

export interface EventStoreAggregate {
  pendingEvents: readonly DomainEvent[]
  lastUpdatedOn?: Date
  id: UniqueEntityID
}
