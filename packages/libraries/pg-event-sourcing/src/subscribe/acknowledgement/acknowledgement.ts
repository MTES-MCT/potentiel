import { SubscriberId } from '../subscriber/subscriberId';

export type Acknowledgement = {
  subscriber_id: SubscriberId;
  stream_id: string;
  created_at: string;
  version: number;
};
