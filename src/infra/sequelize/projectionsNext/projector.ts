import type { Model, ModelStatic, Transaction } from 'sequelize/types';
import { DomainEvent } from '@core/domain';
import { EventHandler } from './eventHandler';
import { Subscribe } from './subscribe';

export interface Projector {
  name: string;

  initialize: (subscribe: Subscribe) => void;

  on: <Event extends DomainEvent>(
    eventClass: new (...args: any[]) => Event,
    eventHandler: EventHandler<Event>,
  ) => EventHandler<Event>;

  rebuild: (transaction: Transaction) => Promise<void>;
}

export type ProjectorFactory = <TModel extends ModelStatic<Model>>(model: TModel) => Projector;
