import { DomainEvent } from '@potentiel-domain/core';

/**
 * @deprecated
 */
export type RebuildTriggered = DomainEvent<
  'RebuildTriggered',
  {
    category: string;
    id: string;
  }
>;
