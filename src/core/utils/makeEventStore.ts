import { Queue } from './Queue'
import { wrapInfra } from './wrapInfra'
import { InfraNotAvailableError, OtherError } from '@modules/shared'
import { DomainEvent, EventBus, EventStore, UniqueEntityID } from '../domain'
import { combine, ResultAsync, Result, unwrapResultOfResult, ok } from './Result'
import { logger } from '.'
import { errAsync } from 'neverthrow'

export interface MakeEventStoreDeps {
  loadAggregateEventsFromStore: (
    aggregateId: string
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
  persistEventsToStore: (events: DomainEvent[]) => ResultAsync<null, InfraNotAvailableError>
  rollbackEventsFromStore: (events: DomainEvent[]) => ResultAsync<null, InfraNotAvailableError>
  publishToEventBus: EventBus['publish']
  subscribe: EventBus['subscribe']
}

export const makeEventStore = (deps: MakeEventStoreDeps): EventStore => {
  const {
    loadAggregateEventsFromStore,
    persistEventsToStore,
    rollbackEventsFromStore,
    publishToEventBus,
    subscribe,
  } = deps

  // Temporary solution to concurrency (ie global lock, to be replaced with aggregateId-level lock)
  const publishQueue = new Queue()

  const publishEventsBatch = (events: DomainEvent[]) => {
    return persistEventsToStore(events)
      .andThen(() => combine(events.map((event) => publishToEventBus(event))))
      .map(() => null)
      .orElse(() => {
        logger.error(
          new Error('EventStore publish to eventbus failed, rolling back events in store')
        )
        rollbackEventsFromStore(events).match(
          () => {
            logger.info('Rollback success')
          },
          () => {
            logger.error(
              new Error(
                'SYSTEM STATE BROKEN: EventStore failed to rollback events (events are in store but have not been emitted in bus'
              )
            )
          }
        )

        return errAsync(new InfraNotAvailableError())
      })
  }

  const publish = (event: DomainEvent) => {
    return publishEventsBatch([event])
  }

  return {
    publish,
    subscribe,
    transaction: <E>(
      aggregateId: UniqueEntityID,
      callback: (aggregateEvents: DomainEvent[]) => ResultAsync<DomainEvent[], E>
    ) => {
      const ticket = publishQueue.push(async () => {
        return loadAggregateEventsFromStore(aggregateId.toString())
          .andThen(callback)
          .andThen(publishEventsBatch)
      })

      return wrapInfra(ticket).andThen(unwrapResultOfResult)
    },
  }
}
