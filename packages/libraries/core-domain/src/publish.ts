import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Publish = (
  aggregateId: AggregateId,
  ...events: ReadonlyArray<DomainEvent>
) => Promise<void>;
