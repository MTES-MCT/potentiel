import { RangeOptions } from '@potentiel-domain/core';

import { Pagination } from './pagination';

/**
 * @deprecated Use mapToPagination from ./pagination.ts module
 */
export const mapToPagination = (
  { startPosition }: RangeOptions,
  itemsPerPage: number,
): Pagination => {
  return {
    currentPage: Math.trunc(startPosition / itemsPerPage) + 1,
    itemsPerPage,
  };
};
