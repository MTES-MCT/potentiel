'use client';

import { FC } from 'react';

import { PageTemplate } from './PageTemplate';
import { ListHeader, ListHeaderProps } from '../organisms/ListHeader';
import { List } from '../organisms/List';
import { ListFilters, ListFiltersProps } from '../organisms/ListFilters';
import { useSearchParams } from 'next/navigation';
import { Heading1 } from '../atoms/headings';
import { LinkAction } from '../atoms/LinkAction';

export type ListPageTemplateProps<TItem> = {
  heading: string;
  filters: ListFiltersProps['filters'];
  tagFilters: ListHeaderProps['tagFilters'];
  actions: Array<{
    name: string;
    link: string;
  }>;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  items: Array<TItem & { key: string }>;
  ItemComponent: FC<TItem>;
};

export const ListPageTemplate = <TItem,>({
  heading,
  actions,
  ItemComponent,
  filters,
  items,
  currentPage,
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
        {filters.length || actions.length ? (
          <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0 md:w-1/4">
            {actions.map((a) => (
              <LinkAction
                label={a.name}
                href={a.link}
                key={a.link}
                className="w-fit fr-link fr-icon-arrow-right-line fr-link--icon-right"
              />
            ))}
            {filters.length ? <ListFilters key={listFiltersKey} filters={filters} /> : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 flex-grow md:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <ListHeader tagFilters={tagFilters} totalCount={totalItems} />
          </div>

          {items.length ? (
            <List
              items={items}
              currentPage={currentPage}
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
