import { EventEmitter } from 'events'
import { DomainEvent } from '../../core/domain'
import {
  ok,
  Result,
  ResultAsync,
  Queue,
  unwrapResultOfResult,
  logger,
  wrapInfra,
} from '../../core/utils'
import { InfraNotAvailableError, OtherError } from '../shared'
import { EventStore, EventStoreHistoryFilters, EventStoreTransactionArgs } from './EventStore'

export abstract class BaseEventStore implements EventStore {
  private queue: Queue

  private eventEmitter: EventEmitter

  constructor() {
    this.queue = new Queue()
    this.eventEmitter = new EventEmitter()
  }

  protected abstract persistEvents(events: DomainEvent[]): ResultAsync<null, InfraNotAvailableError>

  public abstract loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<DomainEvent[], InfraNotAvailableError>

  publish(event: DomainEvent): ResultAsync<null, InfraNotAvailableError> {
    const ticket = this.queue.push(async () => await this._persistAndPublish([event]))

    return wrapInfra(ticket).andThen(unwrapResultOfResult)
  }

  subscribe<T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) {
    this.eventEmitter.on(eventType, callback)
  }

  transaction<T>(
    fn: (args: EventStoreTransactionArgs) => T
  ): ResultAsync<T, InfraNotAvailableError | OtherError> {
    const ticket: Promise<Result<T, InfraNotAvailableError>> = this.queue.push(async () => {
      const eventsToEmit: DomainEvent[] = []

      const callbackResult = await fn({
        loadHistory: (filters) => {
          return this.loadHistory(filters)
        },
        publish: (event: DomainEvent) => {
          eventsToEmit.push(event)
        },
      })
      return eventsToEmit.length
        ? await this._persistAndPublish(eventsToEmit).map(() => callbackResult)
        : ok(callbackResult)
    })

    return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message)).andThen(
      (res) => res
    )
  }

  private _emitEvent(event: DomainEvent) {
    logger.info(`[${event.type}] ${event.aggregateId}`)
    this.eventEmitter.emit(event.type, event)
  }

  private _persistAndPublish = (events: DomainEvent[]) => {
    return this.persistEvents(events).andThen(() => {
      events.forEach(this._emitEvent.bind(this))
      return ok<null, InfraNotAvailableError>(null)
    })
  }
}
