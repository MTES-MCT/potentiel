import { RangeOptions } from '@potentiel-domain/entity';

export type Pagination = {
  currentPage: number;
  itemsPerPage: number;
};

export const mapToPagination = (
  { startPosition }: RangeOptions,
  itemsPerPage: number = defaultItemsPerPage,
): Pagination => {
  return {
    currentPage: Math.trunc(startPosition / itemsPerPage) + 1,
    itemsPerPage,
  };
};

export const mapToRangeOptions = ({
  currentPage,
  itemsPerPage = defaultItemsPerPage,
}: Omit<Pagination, 'itemsPerPage'> & {
  itemsPerPage?: Pagination['itemsPerPage'];
}): RangeOptions => {
  const nextPage = currentPage + 1;

  return {
    endPosition: (nextPage - 1) * itemsPerPage - 1,
    startPosition: (currentPage - 1) * itemsPerPage,
  };
};

export const defaultItemsPerPage = 10;
