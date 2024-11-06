/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';

import { Tile } from './Tile';
import { ListPagination } from './ListPagination';

type ListProps<TItem> = {
  items: Array<TItem & { key: string }>;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  ItemComponent: FC<Omit<TItem, 'key'>>;
};

export const List = <TItem,>({
  items,
  currentPage,
  totalItems,
  itemsPerPage,
  ItemComponent,
}: ListProps<TItem>) => (
  <>
    <ul>
      {items.map(({ key, ...item }) => (
        <li className="mb-6" key={key}>
          <Tile className="flex flex-col md:flex-row md:justify-between">
            <ItemComponent {...item} />
          </Tile>
        </li>
      ))}
    </ul>
    <ListPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />
  </>
);
