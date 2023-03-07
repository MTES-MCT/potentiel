import type { Transaction } from 'sequelize/types';
import { Constructor, DomainEvent, HasType } from '@core/domain';

export type EventHandler<Event> = (event: Event, transaction?: Transaction) => Promise<void>;

export type Subscribe = (cb: (event: DomainEvent) => Promise<void>, consumerName: string) => void;

export interface Projector {
  name: string;

  initialize: (subscribe: Subscribe) => void;

  on: <Event extends DomainEvent>(
    eventClass: Constructor<Event> & HasType,
    eventHandler: EventHandler<Event>,
  ) => EventHandler<Event>;

  rebuild: (transaction: Transaction) => Promise<void>;
}
