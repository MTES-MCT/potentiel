import { DomainEvent } from '../core/domain'
import { EventBus } from '../modules/eventStore'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePublished(eventType: any): R
    }
  }
}
