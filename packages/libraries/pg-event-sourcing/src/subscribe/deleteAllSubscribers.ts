import { executeQuery } from '@potentiel/pg-helpers';

const deleteAllSubscribersQuery = 'delete from event_store.subscriber';

export const deleteAllSubscribers = async () => executeQuery(deleteAllSubscribersQuery);
