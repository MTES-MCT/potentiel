import { DomainEvent } from '@potentiel/core-domain';

export type RebuildTriggered = DomainEvent<
  'RebuildTriggered',
  {
    category: string;
    id: string;
  }
>;
