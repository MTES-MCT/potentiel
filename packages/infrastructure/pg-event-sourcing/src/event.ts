import { DomainEvent } from '@potentiel-domain/core';

export type Event = DomainEvent & {
  version: number;
  created_at: string;
  stream_id: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEvent = (value: any): value is Event => {
  return (
    typeof value?.payload === 'object' &&
    typeof value?.type === 'string' &&
    typeof value?.version === 'number' &&
    typeof value?.created_at === 'string' &&
    typeof value?.stream_id === 'string'
  );
};
