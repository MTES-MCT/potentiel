import { Aggregate } from './aggregate';
import { AggregateFactory } from './aggregateFactory';
import { AggregateId } from './aggregateId';
import { Option } from './helpers/option';

export type LoadAggregate = /*<TAggregate extends Aggregate>*/ (
  aggregateId: AggregateId,
  aggregateFactory: AggregateFactory,
) => Promise<Option<Aggregate>>;
