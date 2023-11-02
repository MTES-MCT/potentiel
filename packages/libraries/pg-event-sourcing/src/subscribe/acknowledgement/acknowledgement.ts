/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export type Acknowledgement = {
  stream_category: string;
  subscriber_name: string;
  stream_id: string;
  created_at: string;
  version: number;
};
