import { EventBus } from '@core/domain'
import { DomainEvent } from '@core/domain'

type MakeDualPublishDeps = {
  redisPublish: EventBus['publish']
  inMemoryPublish: EventBus['publish']
}

export const makeDualPublish = (deps: MakeDualPublishDeps) => (event: DomainEvent) => {
  const { redisPublish, inMemoryPublish } = deps
  redisPublish(event)
  return inMemoryPublish(event)
}
