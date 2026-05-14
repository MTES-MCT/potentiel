import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DomainEvent } from '@potentiel-domain/core';

import { Event } from '../../event.js';

const selectEventByStreamIdAndVersion = `
  SELECT stream_id, created_at, version, type, payload
  FROM event_store.event_stream
  WHERE stream_id = $1 AND version = $2
`;

type GetEventByStreamIdAndVersionProps = {
  streamId: string;
  version: number;
};

export const getEventByStreamIdAndVersion = async <TEvent extends DomainEvent>({
  streamId,
  version,
}: GetEventByStreamIdAndVersionProps) => {
  const [event] = await executeSelect<TEvent & Event>(
    selectEventByStreamIdAndVersion,
    streamId,
    version,
  );
  return event;
};
