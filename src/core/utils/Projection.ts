import { Constructor, DomainEvent, HasType } from '../domain'
import { ResultAsync } from '../../core/utils'

export interface EventHandler<Event> {
  (event: Event): Promise<void>
}

export interface Projector {
  initEventStream: (eventStream: HasSubscribe) => void

  on: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>
  ) => EventHandler<Event>
}
export interface HasSubscribe {
  subscribe: (cb: (event: DomainEvent) => Promise<void>, consumerName: string) => void
}
