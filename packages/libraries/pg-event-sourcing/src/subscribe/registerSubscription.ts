import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from '../event';

const insertSubscriberQuery = 'insert into event_store.subscriber values($1, $2)';

export const registerSubscriber = async <TDomainEvent extends DomainEvent = Event>({
  eventType,
  name,
}: Subscriber<TDomainEvent>) => {
  const filter =
    eventType === 'all' ? null : JSON.stringify(Array.isArray(eventType) ? eventType : [eventType]);
  await executeQuery(insertSubscriberQuery, name, filter);
};
