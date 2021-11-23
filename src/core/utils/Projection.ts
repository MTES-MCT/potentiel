import { Constructor, DomainEvent, HasType } from '../domain'

export interface EventHandler<Event> {
  (event: Event): any
}

export interface Projector {
  initEventStream: (eventStream: EventStream) => void

  handle: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>
  ) => EventHandler<Event>

  rebuild: () => Promise<void>
}
export interface EventStream {
  handle: <Event extends DomainEvent>(event: Event['type'], cb: (event: Event) => unknown) => void
  lock: () => Promise<void>
  unlock: () => Promise<void>
}

export interface EventStreamFactory {
  (streamName: string): EventStream
}
