import { Aggregate } from './aggregate';
import { AggregateFactory } from './aggregateFactory';
import { AggregateId } from './aggregateId';
import { Option } from './helpers/option';

export type LoadAggregate = <TState>(
  aggregateId: AggregateId,
  aggregateFactory: AggregateFactory<TState>,
) => Promise<Option<Aggregate & TState>>;
