import { DomainEvent, Constructor } from '../core/domain'
import { EventBus } from '../modules/eventStore'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePublished(eventClass: Constructor<DomainEvent>): R
      toHavePublishedTimes(times: number): R
    }
  }
}
