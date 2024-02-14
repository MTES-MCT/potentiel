import { Request } from 'express';

const defaultPage = 1;
const defaultPageSize = 10;

type Pagination = {
  page: number;
  pageSize: number;
};

type RequestWithPaginationParameters = Request<
  {},
  {},
  {},
  {
    page?: string;
    pageSize?: string;
  }
>;

export const getPagination = (request: RequestWithPaginationParameters): Pagination => {
  return {
    page: getPage(request),
    pageSize: getPageSize(request),
  };
};

const getPage = (request: RequestWithPaginationParameters) => {
  if (request.query.page && Number.isInteger(Number.parseInt(request.query.page ?? ''))) {
    return Number.parseInt(request.query.page);
  }

  return defaultPage;
};

const getPageSize = (request: RequestWithPaginationParameters) => {
  if (request.query.pageSize && Number.isInteger(Number.parseInt(request.query.pageSize ?? ''))) {
    return Number.parseInt(request.query.pageSize);
  }

  return defaultPageSize;
};
