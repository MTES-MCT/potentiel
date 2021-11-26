import { okAsync } from 'neverthrow'
import { DomainEvent, EventBus } from '../../core/domain'

type MakeDualEventBusDeps = {
  eventBuses: EventBus[]
}

export const makeDualEventBus = ({ eventBuses }: MakeDualEventBusDeps): EventBus => {
  return {
    publish: (event) => {
      eventBuses.map((eventBus) => eventBus.publish(event))
      return okAsync(null)
    },
    subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {},
  }
}
