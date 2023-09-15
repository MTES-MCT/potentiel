import { executeQuery } from '@potentiel/pg-helpers';
import { Acknowledgement } from './acknowledgement';

const deletePendingAcknowledgementQuery = `
  delete 
  from event_store.pending_acknowledgement 
  where stream_category = $1 and
        subscriber_name = $2 and
        stream_id = $3 and 
        created_at = $4 and 
        version = $5`;

export const acknowledge = async ({
  subscriber_name,
  stream_category,
  stream_id,
  created_at,
  version,
}: Acknowledgement) =>
  executeQuery(
    deletePendingAcknowledgementQuery,
    stream_category,
    subscriber_name,
    stream_id,
    created_at,
    version,
  );
