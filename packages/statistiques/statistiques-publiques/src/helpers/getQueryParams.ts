import type { Cycle } from './cycle.type.js';

export const getQueryParams = (statisticType: string, cycle?: Cycle) =>
  cycle ? [statisticType, cycle] : [statisticType];
