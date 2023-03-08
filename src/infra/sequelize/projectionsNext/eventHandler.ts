import { Transaction } from 'sequelize/types';

export type EventHandler<Event> = (event: Event, transaction?: Transaction) => Promise<void>;
