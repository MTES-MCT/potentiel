import { RangeOptions } from './rangeOptions';

export type HistoryRecord = {
  category: string;
  id: string;
  createdAt: string;
  type: string;
  payload: Record<string, unknown>;
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
