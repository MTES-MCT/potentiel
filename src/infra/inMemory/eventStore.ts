import { DomainEvent } from '../../core/domain'
import { okAsync, ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../../modules/shared'
import { BaseEventStore } from '../eventStore'

export class InMemoryEventStore extends BaseEventStore {
  private history: DomainEvent[] = []

  protected persistEvents(events: DomainEvent[]): ResultAsync<null, InfraNotAvailableError> {
    events.forEach((event) => this.history.push(event))
    return okAsync<null, InfraNotAvailableError>(null)
  }

  public loadHistory(aggregateId: string): ResultAsync<DomainEvent[], InfraNotAvailableError> {
    return okAsync<DomainEvent[], InfraNotAvailableError>(
      this.history.filter((event) => event.aggregateId === aggregateId)
    )
  }
}
