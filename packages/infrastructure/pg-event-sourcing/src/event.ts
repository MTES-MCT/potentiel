import { DomainEvent } from '@potentiel-domain/core';

export type Event = DomainEvent & {
  version: number;
  created_at: string;
  stream_id: string;
};

export const isEvent = (value: unknown): value is Event => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const val = value as Record<string, unknown>;

  return (
    typeof val.payload === 'object' &&
    typeof val.type === 'string' &&
    typeof val.version === 'number' &&
    typeof val.created_at === 'string' &&
    typeof val.stream_id === 'string'
  );
};
