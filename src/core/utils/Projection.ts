import { Constructor, DomainEvent, HasType } from '../domain'

export interface EventHandler<Event> {
  (event: Event): any
}

export interface Projector {
  initEventStream: (eventStream: HasSubscribe) => void

  on: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>
  ) => EventHandler<Event>
}
export interface HasSubscribe {
  subscribe: <Event extends DomainEvent>(
    event: Event['type'],
    cb: (event: Event) => unknown,
    consumerName?: string
  ) => void
}
