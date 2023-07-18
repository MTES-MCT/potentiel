import { Request } from 'express';
import { Pagination } from '../../types';

export const getDefaultPagination = ({
  cookies,
  pageSize = 10,
}: {
  cookies: Request['cookies'];
  pageSize?: number;
}): Pagination => ({
  page: 1,
  pageSize: Number(cookies?.pageSize) || pageSize,
});
