import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { Acknowledgement } from './acknowledgement.js';

const deletePendingAcknowledgementQuery = `
  delete 
  from event_store.pending_acknowledgement 
  where stream_category = $1 and
        subscriber_name = $2 and
        stream_id = $3 and 
        created_at = $4 and 
        version = $5`;

const upateAcknowledgementErrorQuery = `
  update 
  event_store.pending_acknowledgement 
  set error = $1
  where stream_category = $2 and
        subscriber_name = $3 and
        stream_id = $4 and 
        created_at = $5 and 
        version = $6`;

export const acknowledge = ({
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

export const acknowledgeError = (
  { subscriber_name, stream_category, stream_id, created_at, version }: Acknowledgement,
  { message }: Error,
) =>
  executeQuery(
    upateAcknowledgementErrorQuery,
    message,
    stream_category,
    subscriber_name,
    stream_id,
    created_at,
    version,
  );
