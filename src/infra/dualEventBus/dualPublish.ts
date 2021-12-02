import { EventBus } from '../../core/domain'
import { DomainEvent } from '../../core/domain/DomainEvent'

type MakePublishEventDeps = {
  publishInRedisEventBus: EventBus['publish']
  publishInMemory: EventBus['publish']
}

export const makePublishToEventBus = (deps: MakePublishEventDeps) => (event: DomainEvent) => {
  const { publishInRedisEventBus, publishInMemory } = deps
  publishInRedisEventBus(event)
  return publishInMemory(event)
}
