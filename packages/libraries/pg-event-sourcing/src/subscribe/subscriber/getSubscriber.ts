import { executeSelect } from '@potentiel/pg-helpers';
import { SubscriberId } from './subscriberId';
import { Subscriber } from '@potentiel/core-domain';

const selectSubscriber = `
  select 
    subscriber_id, 
    filter
  from event_store.subscriber
  where subscriber_id = $1
`;

export const getSubscriber = async (streamCategory: string, subscriberName: string) => {
  const subscriberId: SubscriberId = `${streamCategory}|${subscriberName}`;
  return await executeSelect<Omit<Subscriber, 'eventHandler'>>(selectSubscriber, subscriberId);
};
