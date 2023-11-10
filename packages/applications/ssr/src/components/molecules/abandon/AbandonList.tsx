'use client';
import { FC } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { Pagination } from '../../organisms/Pagination';
import { Tile } from '../../organisms/Tile';
import { AbandonListItem } from './AbandonListItem';

type AbandonListProps = {
  abandons: {
    items: Array<Parameters<typeof AbandonListItem>[0]>;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const AbandonList: FC<AbandonListProps> = ({ abandons }) => {
  const pathname = usePathname();
  const currentPage = +useParams<{ page: string }>().page;

  const searchParams = useSearchParams();

  const pageCount = Math.ceil(abandons.totalItems / abandons.itemsPerPage);

  const getPageUrl = (pageToGo: number): string => {
    const urlSearchParams = new URLSearchParams(searchParams).toString();
    return `${pathname.replace(`/${currentPage}`, `/${pageToGo}`)}${
      urlSearchParams ? `?${urlSearchParams}` : ''
    }`;
  };

  return (
    <>
      <ul>
        {abandons.items.map((abandon) => (
          <li className="mb-6" key={`abandon-projet-${abandon.identifiantProjet}`}>
            <Tile className="flex flex-col md:flex-row md:justify-between">
              <AbandonListItem {...abandon} />
            </Tile>
          </li>
        ))}
      </ul>

      <Pagination getPageUrl={getPageUrl} currentPage={currentPage} pageCount={pageCount} />
    </>
  );
};
