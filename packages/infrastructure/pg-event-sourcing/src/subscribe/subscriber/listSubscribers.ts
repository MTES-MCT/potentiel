import { executeSelect } from '@potentiel-libraries/pg-helpers';

const listSubscribersQuery = `
  select
    stream_category, subscriber_name
  from event_store.subscriber
`;

export const listSubscribers = async () => {
  const allSubscribers = await executeSelect<{
    stream_category: string;
    subscriber_name: string;
  }>(listSubscribersQuery);

  return allSubscribers;
};
