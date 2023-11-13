'use client';
import { FC } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { Pagination } from './Pagination';
import { Tile } from './Tile';

type ListProps<TItem> = {
  items: Array<TItem & { key: string }>;
  totalItems: number;
  itemsPerPage: number;
  ItemComponent: FC<TItem>;
};

export const List = <TItem,>({
  items,
  totalItems,
  itemsPerPage,
  ItemComponent,
}: ListProps<TItem>) => {
  const pathname = usePathname();
  const currentPage = +useParams<{ page: string }>().page;
  const searchParams = useSearchParams();
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const getPageUrl = (pageToGo: number): string => {
    const urlSearchParams = new URLSearchParams(searchParams).toString();
    return `${pathname.replace(`/${currentPage}`, `/${pageToGo}`)}${
      urlSearchParams ? `?${urlSearchParams}` : ''
    }`;
  };

  return (
    <>
      <ul>
        {items.map((item) => (
          <li className="mb-6" key={`abandon-projet-${item.key}`}>
            <Tile className="flex flex-col md:flex-row md:justify-between">
              <ItemComponent {...item} />
            </Tile>
          </li>
        ))}
      </ul>

      <Pagination getPageUrl={getPageUrl} currentPage={currentPage} pageCount={pageCount} />
    </>
  );
};
