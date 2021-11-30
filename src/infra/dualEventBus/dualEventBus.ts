import { EventBus } from '../../core/domain'

type MakeDualEventBusDeps = {
  inMemoryEventBus: EventBus
  redisEventBus: EventBus
}

export const makeDualEventBus = ({
  inMemoryEventBus,
  redisEventBus,
}: MakeDualEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      redisEventBus.publish(event)
      return inMemoryEventBus.publish(event)
    },
    subscribe: inMemoryEventBus.subscribe,
  }
}
