import type { Transaction } from 'sequelize/types';
import { Constructor, DomainEvent, HasType } from '../../../core/domain'

export interface EventHandler<Event> {
  (event: Event, transaction?: Transaction): Promise<void>
}

export interface Projector {
  initEventStream: (eventStream: HasSubscribe) => void

  on: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>
  ) => EventHandler<Event>

  rebuild: (transaction: Transaction) => Promise<void>
}
export interface HasSubscribe {
  subscribe: (cb: (event: DomainEvent) => Promise<void>, consumerName: string) => void
}
