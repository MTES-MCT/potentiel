'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { Pagination } from '@codegouvfr/react-dsfr/Pagination';

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
    const params = new URLSearchParams(searchParams);
    params.set('page', pageToGo.toString());
    return `${pathname}${params.size > 0 ? `?${params.toString()}` : ''}`;
  };

  const getPageLinkProps = (pageToGo: number) => ({
    href: getPageUrl(pageToGo),
  });

  return (
    <div className="w-full flex flex-row justify-center">
      <Pagination count={pageCount} defaultPage={currentPage} getPageLinkProps={getPageLinkProps} />
    </div>
  );
};
