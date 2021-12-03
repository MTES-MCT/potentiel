import EventEmitter from 'events'
import { okAsync } from 'neverthrow'
import { DomainEvent } from '../../core/domain'
import { EventBus } from '../../core/domain/EventBus'
import { logger, Queue } from '../../core/utils'

type MakeInMemoryPublishDeps = {
  eventEmitter: EventEmitter
}
type MakeInMemorySubscribeDeps = {
  eventEmitter: EventEmitter
}
export const makeInMemoryPublish = ({
  eventEmitter,
}: MakeInMemoryPublishDeps): EventBus['publish'] => (event: DomainEvent) => {
  logger.info(`[${event.type}] ${event.aggregateId}`)
  eventEmitter.emit(event.type, event)
  return okAsync(null)
}

export const makeInMemorySubscribe = ({
  eventEmitter,
}: MakeInMemorySubscribeDeps): EventBus['subscribe'] => {
  const handleQueue = new Queue()
  return <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {
    eventEmitter.on(eventType, (event: T) => {
      handleQueue.push(async () => await callback(event))
    })
  }
}
