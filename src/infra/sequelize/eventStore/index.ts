import { EventEmitter } from 'events'
import { okAsync, ResultAsync } from 'neverthrow'
import { DomainEvent } from '../../../core/domain'
import { v4 as uuid } from 'uuid'
import {
  EventStore,
  EventStoreTransactionFn,
} from '../../../core/utils/EventStore'
import { InfraNotAvailableError } from '../../../modules/shared'

export class SequelizeEventStore implements EventStore {
  private history: any[] = []

  private queue: Promise<any> = Promise.resolve()

  private eventEmitter: EventEmitter
  private EventStoreModel

  constructor(models) {
    this.eventEmitter = new EventEmitter()
    this.EventStoreModel = models.EventStore
  }

  publish<T extends DomainEvent<P>, P>(event: T) {
    this.queue = this.queue.then(async () => {
      await this._publishSync(event)
    })

    return ResultAsync.fromPromise(this.queue, (e: any) => {
      console.log('SequelizeEventStore publish error', e.message)
      return new InfraNotAvailableError()
    }).map(() => null)
  }

  subscribe = <T extends DomainEvent<P>, P>(
    eventType: ReturnType<T['getType']>,
    callback: (payload: P) => void
  ): void => {
    this.eventEmitter.on(eventType, callback)
  }

  public transaction(fn: EventStoreTransactionFn) {
    this.queue = this.queue.then(() => {
      return fn({ loadHistory: () => this.history, publish: this._publishSync })
    })
    return this.queue
  }

  private toPersistance<T extends DomainEvent<P>, P>(event: T) {
    return {
      id: uuid(),
      type: event.getType(),
      version: event.getVersion(),
      payload: event.payload,
      occurredAt: event.occurredAt,
    }
  }

  private _publishSync = <T extends DomainEvent<P>, P>(event: T) => {
    return ResultAsync.fromPromise(
      this.EventStoreModel.create(this.toPersistance(event)),
      () => new InfraNotAvailableError()
    ).andThen(() => {
      this.eventEmitter.emit(event.getType(), event.payload)
      return okAsync(null)
    })
  }
}
