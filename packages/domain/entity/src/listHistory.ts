import { RangeOptions } from './rangeOptions';

export type HistoryRecord<TPayload = Record<string, unknown>> = {
  category: string;
  id: string;
  createdAt: string;
  type: string;
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
