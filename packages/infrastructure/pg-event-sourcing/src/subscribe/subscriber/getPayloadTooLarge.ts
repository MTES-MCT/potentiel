import type { DomainEvent } from '@potentiel-domain/core';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import type { Event } from '../../event.js';

const selectEventByStreamIdAndVersionAndCreatedAt = `
  SELECT payload
  FROM event_store.event_stream
  WHERE stream_id = $1 AND version = $2 AND created_at = $3
`;

type PayloadTooLargeEvent = Event & {
  type: string;
  payload: {
    payload_too_large: true;
  };
};

export const isPayloadTooLargeEvent = (value: Event): value is PayloadTooLargeEvent =>
  'payload_too_large' in value.payload && value.payload.payload_too_large === true;

export const getPayloadTooLarge = async <TEvent extends DomainEvent>({
  stream_id,
  version,
  created_at,
}: PayloadTooLargeEvent) => {
  const [event] = await executeSelect<Pick<TEvent, 'payload'>>(
    selectEventByStreamIdAndVersionAndCreatedAt,
    stream_id,
    version,
    created_at,
  );
  return event.payload;
};
