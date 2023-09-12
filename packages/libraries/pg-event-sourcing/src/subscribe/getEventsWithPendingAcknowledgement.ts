import { executeSelect } from '@potentiel/pg-helpers';
import { Event } from '../event';

const selectEventsWithPendingAcknowledgement = `
   select 
      es.stream_id as "streamId",
      es.created_at "createdAt",
      es.version,
      es.type,
      es.payload
   from event_store.event_stream es 
   inner join event_store.pending_acknowledgement pa on 
      pa.stream_id = es.stream_id and 
      pa.created_at = es.created_at and 
      pa.version = es.version 
   where pa.subscriber_id = $1`;

export const getEventsWithPendingAcknowledgement = async (subscribeId: string) =>
  executeSelect<Event>(selectEventsWithPendingAcknowledgement, subscribeId);
