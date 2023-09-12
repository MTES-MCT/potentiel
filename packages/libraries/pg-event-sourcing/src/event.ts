import { DomainEvent } from '@potentiel/core-domain';

export type Event = DomainEvent & {
  version: number;
  createdAt: string;
  streamId: string;
};

export const isEvent = (value: any): value is Event => {
  return (
    typeof value?.payload === 'object' &&
    typeof value?.type === 'string' &&
    typeof value?.version === 'number' &&
    typeof value?.created_at === 'string' &&
    typeof value?.stream_id === 'string'
  );
};
