import { DomainEvent } from '@potentiel-domain/core';

export type RebuildTriggered = DomainEvent<
  'RebuildTriggered',
  {
    category: string;
    id: string;
  }
>;
