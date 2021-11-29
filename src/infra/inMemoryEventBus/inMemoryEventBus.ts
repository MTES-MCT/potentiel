import EventEmitter from 'events'
import { okAsync } from 'neverthrow'
import { DomainEvent } from '../../core/domain'
import { EventBus } from '../../core/domain/EventBus'
import { logger, Queue, unwrapResultOfResult, wrapInfra } from '../../core/utils'

export const makeInMemoryEventBus = (): EventBus => {
  const handleQueue = new Queue()
  const eventEmitter = new EventEmitter()

  return {
    publish: (event) => {
      logger.info(`[${event.type}] ${event.aggregateId}`)
      eventEmitter.emit(event.type, event)

      return okAsync(null)
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {
      eventEmitter.on(eventType, (event: T) => {
        handleQueue.push(async () => await callback(event))
      })
    },
  }
}
