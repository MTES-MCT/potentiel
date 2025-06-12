import { RangeOptions } from './rangeOptions';

export type HistoryRecord<
  TCategory extends string = string,
  TType extends string = string,
  TPayload = Record<string, unknown>,
> = {
  category: TCategory;
  id: string;
  createdAt: string;
  type: TType;
  payload: TPayload;
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
