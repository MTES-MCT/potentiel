import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { SubscriberConfiguration } from './subscriberConfiguration.js';
import { checkSubscriberName } from './checkSubscriberName.js';

const upsertSubscriberQuery = `
  insert into event_store.subscriber 
  values($1, $2, $3)
  on conflict (stream_category, subscriber_name)
  do update set filter = $3
`;

export const registerSubscriber = async ({
  eventType,
  name,
  streamCategory,
}: SubscriberConfiguration) => {
  checkSubscriberName(name);
  const filter =
    eventType === 'all' ? null : JSON.stringify(Array.isArray(eventType) ? eventType : [eventType]);
  await executeQuery(upsertSubscriberQuery, streamCategory, name, filter);
};
