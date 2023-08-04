import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from '../event';

const deletePendingAcknowledgementQuery =
  'delete from event_store.pending_acknowledgement where subscriber_id = $1 and stream_id = $2 and created_at = $3 and version = $4';

export const acknowledge = async (
  subscriberName: string,
  { stream_id, created_at, version }: Event,
) =>
  executeQuery(deletePendingAcknowledgementQuery, subscriberName, stream_id, created_at, version);
