import { Constructor, DomainEvent, HasType } from '../domain'

export interface EventHandler<Event> {
  (event: Event): Promise<void>
}

export interface Projector {
  initEventStream: (eventStream: HasSubscribe) => void

  on: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>
  ) => EventHandler<Event>

  handleEvent: <Event extends DomainEvent>(event: Event) => Promise<void>
  getListenedEvents: () => DomainEvent['type'][]
}
export interface HasSubscribe {
  subscribe: (cb: (event: DomainEvent) => Promise<void>, consumerName: string) => void
}
