import { ResultAsync, okAsync } from '../../core/utils'
import { BaseEventStore, EventStoreHistoryFilters, StoredEvent } from '../../modules/eventStore'
import { InfraNotAvailableError } from '../../modules/shared'

export class InMemoryEventStore extends BaseEventStore {
  private history: StoredEvent[] = []

  protected persistEvent(event: StoredEvent): ResultAsync<null, InfraNotAvailableError> {
    this.history.push(event)
    return okAsync<null, InfraNotAvailableError>(null)
  }

  public loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError> {
    let history = this.history

    if (filters) {
      const { eventType, requestId, payload, aggregateId } = filters

      if (eventType) {
        if (Array.isArray(eventType)) {
          history = history.filter((event) => eventType.includes(event.type))
        } else {
          history = history.filter((event) => event.type === eventType)
        }
      }

      if (requestId) {
        history = history.filter((event) => event.requestId === requestId)
      }

      if (aggregateId) {
        history = history.filter((event) => event.aggregateId === aggregateId)
      }

      if (payload) {
        history = history.filter((event) =>
          Object.entries(payload).every(([key, value]) => event.payload[key] === value)
        )
      }
    }

    return okAsync<StoredEvent[], InfraNotAvailableError>(history)
  }
}
