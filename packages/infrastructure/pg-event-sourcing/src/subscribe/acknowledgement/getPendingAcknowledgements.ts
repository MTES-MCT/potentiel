import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Acknowledgement } from './acknowledgement';

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
