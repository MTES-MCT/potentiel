import { Aggregate } from './aggregate';
import { AggregateId } from './aggregateId';

export type LoadAggregate = <TAggregate extends Aggregate>(
  aggregateId: AggregateId,
) => Promise<TAggregate | undefined>;
