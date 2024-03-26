import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { Event } from '../../event';

const selectEventsWithPendingAcknowledgement = `
   select 
      es.stream_id,
      es.created_at,
      es.version,
      es.type,
      es.payload
   from event_store.event_stream es 
   inner join event_store.pending_acknowledgement pa on 
      pa.stream_id = es.stream_id and 
      pa.created_at = es.created_at and 
      pa.version = es.version 
   where pa.stream_category = $1 and subscriber_name = $2`;

export const getEventsWithPendingAcknowledgement = async (
  streamCategory: string,
  subscriberName: string,
) => {
  return await executeSelect<Event>(
    selectEventsWithPendingAcknowledgement,
    streamCategory,
    subscriberName,
  );
};
