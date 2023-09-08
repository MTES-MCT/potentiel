import { executeQuery } from '@potentiel/pg-helpers';

export const deleteAllEvents = async () => {
  await executeQuery(`delete from event_store.event_stream`);
};
