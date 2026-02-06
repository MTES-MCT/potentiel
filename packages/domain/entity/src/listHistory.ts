import { RangeOptions } from './rangeOptions.js';

type DomainEvent<TType extends string = string, TPayload extends Record<string, unknown> = {}> = {
  type: TType;
  payload: TPayload;
};

export type HistoryRecord<
  TCategory extends string = string,
  TEvent extends DomainEvent = DomainEvent,
> = TEvent & {
  category: TCategory;
  id: string;
  createdAt: string;
};

export type ListHistoryOptions<TCategory> = {
  category?: TCategory;
  id?: string;
  range?: RangeOptions;
};

export type ListHistoryResult<TRecord extends HistoryRecord> = {
  total: number;
  items: ReadonlyArray<TRecord>;
  range: RangeOptions;
};

export type ListHistory<TRecord extends HistoryRecord> = <TCategory extends TRecord['category']>(
  options?: ListHistoryOptions<TCategory>,
) => Promise<ListHistoryResult<Extract<TRecord, { category: TCategory }>>>;
