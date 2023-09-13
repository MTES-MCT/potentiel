import { executeQuery } from '@potentiel/pg-helpers';
import { Acknowledgement } from './acknowledgement';

const deletePendingAcknowledgementQuery = `
  delete 
  from event_store.pending_acknowledgement 
  where subscriber_id = $1 and 
        stream_id = $2 and 
        created_at = $3 and 
        version = $4`;

export const acknowledge = async ({
  subscriber_id,
  stream_id,
  created_at,
  version,
}: Acknowledgement) =>
  executeQuery(deletePendingAcknowledgementQuery, subscriber_id, stream_id, created_at, version);
