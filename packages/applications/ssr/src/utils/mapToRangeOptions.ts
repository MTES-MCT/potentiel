import { RangeOptions } from '@potentiel-domain/entity';

import { Pagination } from './pagination';

/**
 * @deprecated Use mapToPagination from ./pagination.ts module
 */
export const mapToRangeOptions = ({ currentPage, itemsPerPage }: Pagination): RangeOptions => {
  const nextPage = currentPage + 1;

  return {
    endPosition: (nextPage - 1) * itemsPerPage - 1,
    startPosition: (currentPage - 1) * itemsPerPage,
  };
};
