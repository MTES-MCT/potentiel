import { DomainEvent } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from '../../event';
import { SubscriberConfiguration } from './subscriberConfiguration';

const upsertSubscriberQuery = `
  insert into event_store.subscriber 
  values($1, $2)
  on conflict (subscriber_id)
  do update set filter = $2
`;

export const registerSubscriber = async <TDomainEvent extends DomainEvent = Event>({
  eventType,
  name,
  streamCategory,
}: SubscriberConfiguration) => {
  const filter =
    eventType === 'all' ? null : JSON.stringify(Array.isArray(eventType) ? eventType : [eventType]);
  await executeQuery(upsertSubscriberQuery, `${streamCategory}|${name}`, filter);
};
