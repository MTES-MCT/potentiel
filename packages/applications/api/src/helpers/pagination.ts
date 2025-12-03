import { RangeOptions } from '@potentiel-domain/entity';

export const defaultItemsPerPage = 50;

export const mapToRangeOptions = (
  page: number | undefined,
  itemsPerPage = defaultItemsPerPage,
): RangeOptions => {
  const currentPage = page ?? 0;

  return {
    startPosition: currentPage * itemsPerPage,
    endPosition: (currentPage + 1) * itemsPerPage - 1,
  };
};
