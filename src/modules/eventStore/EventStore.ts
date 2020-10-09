import { ok, Result, ResultAsync } from 'neverthrow'
import { InfraNotAvailableError, OtherError } from '../shared'
import { DomainEvent } from '../../core/domain/DomainEvent'

import {
  CandidateNotificationForPeriodeFailed,
  CandidateNotifiedForPeriode,
  PeriodeNotified,
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  LegacyProjectEventSourced,
  LegacyProjectSourced,
  ProjectImported,
} from '../project/events'
import { mapResults, Queue } from '../../core/utils'
import { Store } from 'express-session'
import { EventEmitter } from 'events'
import { ProjectReimported } from '../project/events/ProjectReimported'

export type StoredEvent =
  | ProjectNotified
  | ProjectCertificateGenerated
  | ProjectCertificateGenerationFailed
  | PeriodeNotified
  | CandidateNotificationForPeriodeFailed
  | CandidateNotifiedForPeriode
  | ProjectDCRDueDateSet
  | ProjectGFDueDateSet
  | LegacyProjectEventSourced
  | LegacyProjectSourced
  | ProjectImported
  | ProjectReimported

export interface EventStoreHistoryFilters {
  eventType?: StoredEvent['type'] | StoredEvent['type'][]
  requestId?: DomainEvent['requestId']
  aggregateId?: DomainEvent['aggregateId']
  payload?: Record<string, any>
}

export type EventStoreTransactionFn = (args: {
  loadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<StoredEvent[], InfraNotAvailableError>
  publish: (event: StoredEvent) => void
}) => any

export interface EventStore {
  publish: (event: StoredEvent) => ResultAsync<null, InfraNotAvailableError>
  subscribe: <T extends StoredEvent>(
    eventType: T['type'],
    callback: (event: T) => any
  ) => void
  transaction: (
    fn: EventStoreTransactionFn
  ) => ResultAsync<ReturnType<typeof fn>, InfraNotAvailableError | OtherError>
}

export abstract class BaseEventStore implements EventStore {
  private queue: Queue

  private eventEmitter: EventEmitter

  constructor() {
    this.queue = new Queue()
    this.eventEmitter = new EventEmitter()
  }

  protected abstract persistEvent(
    event: StoredEvent
  ): ResultAsync<null, InfraNotAvailableError>

  public abstract loadHistory(
    filters?: EventStoreHistoryFilters
  ): ResultAsync<StoredEvent[], InfraNotAvailableError>

  publish(event: StoredEvent): ResultAsync<null, InfraNotAvailableError> {
    const ticket = this.queue.push(
      async () => await this._persistAndPublish(event)
    )

    return ResultAsync.fromPromise(
      ticket,
      () => new InfraNotAvailableError()
    ).andThen((result) => result)
  }

  subscribe<T extends StoredEvent>(
    eventType: T['type'],
    callback: (event: T) => any
  ) {
    // console.log('SequelizeEventStore subscription to', eventType)

    this.eventEmitter.on(eventType, callback)
  }

  transaction(
    fn: EventStoreTransactionFn
  ): ResultAsync<ReturnType<typeof fn>, InfraNotAvailableError | OtherError> {
    const ticket: Promise<Result<
      ReturnType<typeof fn>,
      InfraNotAvailableError
    >> = this.queue.push(async () => {
      const eventsToEmit: StoredEvent[] = []

      const callbackResult = await fn({
        loadHistory: (filters) => {
          // console.log('SequelizeEventStore loadHistory inside transaction')
          return this.loadHistory(filters)
        },
        publish: (event: StoredEvent) => {
          // console.log('SequelizeEventStore publish inside transaction', event)
          eventsToEmit.push(event)
        },
      })
      // TODO: if one peristence fails, rollback and fail the transaction (ie emit no events?)
      return eventsToEmit.length
        ? await mapResults(eventsToEmit, (event) =>
            this._persistAndPublish(event)
          ).map(() => callbackResult)
        : ok(callbackResult)
    })

    return ResultAsync.fromPromise(
      ticket,
      (e: any) => new OtherError(e.message)
    ).andThen((res) => res)
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
