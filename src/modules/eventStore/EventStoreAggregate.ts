import { StoredEvent } from '.'
import { UniqueEntityID } from '../../core/domain'

export interface EventStoreAggregate {
  pendingEvents: readonly StoredEvent[]
  lastUpdatedOn: Date
  id: UniqueEntityID
}
