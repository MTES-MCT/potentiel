import { DomainEvent, Constructor } from '../core/domain'
import { EventBus } from '../modules/eventStore'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePublished(eventClass: Constructor<DomainEvent>): R
      toHavePublishedWithPayload(eventClass: Constructor<DomainEvent>, payload: any): R
      toHavePublishedTimes(times: number): R
    }
  }
}
