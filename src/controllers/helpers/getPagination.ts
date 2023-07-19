import { Request } from 'express';

const defaultPage = 1;

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
  }
>;

export const getPagination = (request: RequestWithPaginationParameters): Pagination => {
  return {
    page: getPage(request),
    pageSize: 10,
  };
};

const getPage = (request: RequestWithPaginationParameters) => {
  if (request.query.page && Number.isInteger(Number.parseInt(request.query.page ?? ''))) {
    return Number.parseInt(request.query.page);
  }

  return defaultPage;
};
