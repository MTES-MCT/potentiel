import { executeSelect } from '@potentiel/pg-helpers';
import { SubscriberId } from './subscriberId';
import { SubscriberConfiguration } from './subscriberConfiguration';

const selectSubscriber = `
  select
    filter
  from event_store.subscriber
  where subscriber_id = $1
`;

export const getSubscriber = async (streamCategory: string, subscriberName: string) => {
  const subscriberId: SubscriberId = `${streamCategory}|${subscriberName}`;
  const subscriber = await executeSelect<{
    filter?: Array<string>;
  }>(selectSubscriber, subscriberId);

  const filter = subscriber[0].filter ?? [];

  const subscriberConfiguration: SubscriberConfiguration = {
    name: subscriberName,
    streamCategory: streamCategory,
    eventType: filter.length === 0 ? 'all' : filter.length === 1 ? filter[0] : filter,
  };

  return subscriberConfiguration;
};
