'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Pagination } from './Pagination';

type ListPaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
};

export const ListPagination: FC<ListPaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const getPageUrl = (pageToGo: number): string => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set('page', pageToGo.toString());
    return `${pathname}${urlSearchParams.size > 0 ? `?${urlSearchParams.toString()}` : ''}`;
  };

  return <Pagination getPageUrl={getPageUrl} currentPage={currentPage} pageCount={pageCount} />;
};
