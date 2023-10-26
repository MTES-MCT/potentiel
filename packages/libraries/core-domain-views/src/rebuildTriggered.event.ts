import { DomainEvent } from '@potentiel/core-domain';

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type RebuildTriggered = DomainEvent<
  'RebuildTriggered',
  {
    category: string;
    id: string;
  }
>;
