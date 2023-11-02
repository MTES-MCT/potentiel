import { executeSelect } from '@potentiel/pg-helpers';
import { Acknowledgement } from './acknowledgement';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
const selectAcknowledgement = `
  select 
    stream_category,
    subscriber_name, 
    stream_id, 
    created_at, 
    version
  from event_store.pending_acknowledgement
  where stream_category = $1 and subscriber_name = $2
`;

export const getPendingAcknowledgements = async (
  streamCategory: string,
  subscriberName: string,
) => {
  return await executeSelect<Acknowledgement>(
    selectAcknowledgement,
    streamCategory,
    subscriberName,
  );
};
