'use client';

import { FC } from 'react';

import { PageTemplate } from './PageTemplate';
import { ListHeader } from '../organisms/ListHeader';
import { List } from '../organisms/List';
import { ListFilters } from '../organisms/ListFilters';
import { useSearchParams } from 'next/navigation';
import { Heading1 } from '../atoms/headings';

type ListPageTemplateProps<TItem> = {
  heading: string;
  filters: Parameters<typeof ListFilters>[0]['filters'];
  tagFilters: Parameters<typeof ListHeader>[0]['tagFilters'];
  totalItems: number;
  itemsPerPage: number;
  items: Array<TItem & { key: string }>;
  ItemComponent: FC<TItem>;
};

export const ListPageTemplate = <TItem,>({
  heading,
  ItemComponent,
  filters,
  items,
  itemsPerPage,
  tagFilters,
  totalItems,
}: ListPageTemplateProps<TItem>) => {
  /**
   * Use search params as key for the ListFilters component
   * This will force react to mount again this component
   * when the search params changed
   */
  const listFiltersKey = new URLSearchParams(useSearchParams()).toString();

  return (
    <PageTemplate banner={<Heading1 className="text-white">{heading}</Heading1>}>
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0 md:w-1/4">
          <ListFilters key={listFiltersKey} filters={filters} />
        </div>

        <div className="flex flex-col gap-3 flex-grow md:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <ListHeader tagFilters={tagFilters} totalCount={totalItems} />
          </div>

          {items.length ? (
            <List
              items={items}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              ItemComponent={ItemComponent}
            />
          ) : (
            <div className="flex flex-grow">Aucun résultat à afficher</div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};
