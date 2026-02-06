import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { SubscriberConfiguration } from './subscriberConfiguration.js';

const selectSubscriber = `
  select
    filter
  from event_store.subscriber
  where stream_category = $1 and subscriber_name = $2
`;

export const getSubscriber = async (streamCategory: string, subscriberName: string) => {
  const subscriber = await executeSelect<{
    filter?: Array<string>;
  }>(selectSubscriber, streamCategory, subscriberName);

  const filter = subscriber[0].filter ?? [];

  const subscriberConfiguration: SubscriberConfiguration = {
    name: subscriberName,
    streamCategory,
    eventType: filter.length === 0 ? 'all' : filter.length === 1 ? filter[0] : filter,
  };

  return subscriberConfiguration;
};
