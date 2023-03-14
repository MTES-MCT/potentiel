import { Aggregate } from './aggregate';
import { AggregateStateFactory } from './aggregateStateFactory';
import { AggregateId } from './aggregateId';
import { Option } from './helpers/option';

export type LoadAggregate = <TState>(
  aggregateId: AggregateId,
  aggregateFactory: AggregateStateFactory<TState>,
) => Promise<Option<Aggregate & TState>>;
