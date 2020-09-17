import { DomainEvent } from '../domain/DomainEvent'

export interface EventBus {
  publish: <T extends DomainEvent<P>, P>(event: T) => void
  subscribe: <T extends DomainEvent<P>, P>(
    eventType: T['type'],
    callback: (payload: P) => void
  ) => void
}
