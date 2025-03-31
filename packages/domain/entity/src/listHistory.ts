import { RangeOptions } from './rangeOptions';

export type HistoryRecord<
  TCategory = string,
  TType = string,
  TPayload = Record<string, unknown>,
> = {
  category: TCategory;
  id: string;
  createdAt: string;
  type: TType;
  payload: TPayload;
};

export type ListHistoryOptions = {
  category?: string;
  id?: string;
  range?: RangeOptions;
};

export type ListHistoryResult<TRecord extends HistoryRecord = HistoryRecord> = {
  total: number;
  items: ReadonlyArray<TRecord>;
  range: RangeOptions;
};

export type ListHistory = <TRecord extends HistoryRecord = HistoryRecord>(
  options?: ListHistoryOptions,
) => Promise<ListHistoryResult<TRecord>>;
