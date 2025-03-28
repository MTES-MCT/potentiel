import { RangeOptions } from './rangeOptions';

export type HistoryRecord<TType = string, TPayload = Record<string, unknown>> = {
  category: string;
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

export type ListHistoryResult = {
  total: number;
  items: ReadonlyArray<HistoryRecord>;
  range: RangeOptions;
};

export type ListHistory = (options?: ListHistoryOptions) => Promise<ListHistoryResult>;
