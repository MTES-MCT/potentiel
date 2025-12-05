import { RangeOptions } from '@potentiel-domain/entity';

export const defaultItemsPerPage = 50;

export const mapToRangeOptions = (
  after: number | undefined,
  itemsPerPage = defaultItemsPerPage,
): RangeOptions => {
  return {
    startPosition: after ? after + 1 : 0,
    endPosition: (after || 0) + itemsPerPage - 1,
  };
};
