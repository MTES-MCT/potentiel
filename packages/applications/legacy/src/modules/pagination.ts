export type Pagination = {
  page: number;
  pageSize: number;
};

export type PaginatedList<T> = {
  items: Array<T>;
  pagination: Pagination;
  pageCount: number;
  itemCount: number;
};
