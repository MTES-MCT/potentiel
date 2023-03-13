import { Aggregate } from './aggregate';
import { AggregateId } from './aggregateId';
import { None } from './helpers/none';

export type LoadAggregate = /*<TAggregate extends Aggregate>*/ (
  aggregateId: AggregateId,
) => Promise<Aggregate | None>;
