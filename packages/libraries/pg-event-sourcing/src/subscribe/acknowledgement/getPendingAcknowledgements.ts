import { executeSelect } from '@potentiel/pg-helpers';
import { SubscriberId } from '../subscriber/subscriberId';
import { Acknowledgement } from './acknowledgement';

const selectAcknowledgement = `
  select 
    subscriber_id, 
    stream_id, 
    created_at, 
    version
  from event_store.pending_acknowledgement
  where subscriber_id = $1
`;

export const getPendingAcknowledgements = async (
  streamCategory: string,
  subscriberName: string,
) => {
  const subscriberId: SubscriberId = `${streamCategory}|${subscriberName}`;
  return await executeSelect<Acknowledgement>(selectAcknowledgement, subscriberId);
};
