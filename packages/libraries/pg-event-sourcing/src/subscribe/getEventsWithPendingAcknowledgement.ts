import { executeSelect } from '@potentiel/pg-helpers';
import { Event } from '../event';

const selectEventsWithPendingAcknowledgement =
  'select es.* from event_store.event_stream es inner join event_store.pending_acknowledgement pa on pa.stream_id = es.stream_id and pa.created_at = es.created_at and pa.version = es.version where pa.subscriber_id = $1';

export const getEventsWithPendingAcknowledgement = async (subscribeName: string) =>
  executeSelect<Event>(selectEventsWithPendingAcknowledgement, subscribeName);
