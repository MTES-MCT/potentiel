import { Pagination, PaginatedList } from '../types';

const paginate = (pagination?: Pagination) => {
  if (!pagination) return {};

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

const nullPagination = (count): Pagination => ({
  pageSize: count,
  page: 0,
});

const makePaginatedList = <T>(
  items: Array<T>,
  count: number,
  pagination?: Pagination,
): PaginatedList<T> => {
  return {
    items,
    pagination: pagination || nullPagination(count),
    pageCount: pagination ? pageCount(pagination, count) : 1,
    itemCount: count,
  };
};

export { paginate, pageCount, makePaginatedList };
