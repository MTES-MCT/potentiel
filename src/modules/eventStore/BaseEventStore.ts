import { EventEmitter } from 'events'
import { ok, Result, ResultAsync } from 'neverthrow'
import { mapResults, Queue } from '../../core/utils'
import { InfraNotAvailableError, OtherError } from '../shared'
import { StoredEvent } from './StoredEvent'
import { EventStore, EventStoreHistoryFilters, EventStoreTransactionFn } from './EventStore'

export abstract class BaseEventStore implements EventStore {
  private queue: Queue

  private eventEmitter: EventEmitter

  constructor() {
    this.queue = new Queue()
    this.eventEmitter = new EventEmitter()
  }

  protected abstract persistEvent(event: StoredEvent): ResultAsync<null, InfraNotAvailableError>

  public abstract loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError>

  publish(event: StoredEvent): ResultAsync<null, InfraNotAvailableError> {
    const ticket = this.queue.push(async () => await this._persistAndPublish(event))

    return ResultAsync.fromPromise(ticket, () => new InfraNotAvailableError()).andThen(
      (result) => result
    )
  }

  subscribe<T extends StoredEvent>(eventType: T['type'], callback: (event: T) => any) {
    this.eventEmitter.on(eventType, callback)
  }

  transaction(
    fn: EventStoreTransactionFn
  ): ResultAsync<ReturnType<typeof fn>, InfraNotAvailableError | OtherError> {
    const ticket: Promise<Result<ReturnType<typeof fn>, InfraNotAvailableError>> = this.queue.push(
      async () => {
        const eventsToEmit: StoredEvent[] = []

        const callbackResult = await fn({
          loadHistory: (filters) => {
            return this.loadHistory(filters)
          },
          publish: (event: StoredEvent) => {
            eventsToEmit.push(event)
          },
        })
        // TODO: if one peristence fails, rollback and fail the transaction (ie emit no events?)
        return eventsToEmit.length
          ? await mapResults(eventsToEmit, (event) => this._persistAndPublish(event)).map(
              () => callbackResult
            )
          : ok(callbackResult)
      }
    )

    return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message)).andThen(
      (res) => res
    )
  }

  private _emitEvent(event: StoredEvent) {
    console.log('Event: publish [' + event.type + ']', event.aggregateId)
    this.eventEmitter.emit(event.type, event)
  }

  private _persistAndPublish = (event: StoredEvent) => {
    return this.persistEvent(event).andThen(() => {
      this._emitEvent(event)
      return ok(null)
    })
  }
}
