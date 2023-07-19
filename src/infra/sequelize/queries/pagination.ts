import { PaginatedList, Pagination } from '@modules/pagination';

export const mapToOffsetAndLimit = (pagination: Pagination) => {
  const { page, pageSize } = pagination;
  const offset = page > 1 ? (page - 1) * pageSize : 0;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
};

const pageCount = (pagination: Pagination, itemCount: number) => {
  return Math.ceil(itemCount / pagination.pageSize);
};

const defaultPagination = (count): Pagination => ({
  pageSize: count,
  page: 0,
});

export const makePaginatedList = <T>(
  items: Array<T>,
  count: number,
  pagination?: Pagination,
): PaginatedList<T> => {
  return {
    items,
    pagination: pagination || defaultPagination(count),
    pageCount: pagination ? pageCount(pagination, count) : 1,
    itemCount: count,
  };
};
