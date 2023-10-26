import { Option } from '@potentiel/monads';
import { Aggregate } from './aggregate';
import { AggregateFactory } from './aggregateFactory';
import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type LoadAggregate = <
  TAggregate extends Record<string, unknown>,
  TDomainEvent extends DomainEvent,
>(
  aggregateId: AggregateId,
  aggregateStateFactory: AggregateFactory<TAggregate, TDomainEvent>,
) => Promise<Option<Aggregate & TAggregate>>;
