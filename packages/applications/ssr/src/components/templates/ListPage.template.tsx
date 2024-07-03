'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { LinkAction } from '../atoms/LinkAction';
import { Heading1, Heading2 } from '../atoms/headings';
import { Search, SearchProps } from '../molecules/Search';
import { List } from '../organisms/List';
import { ListFilters, ListFiltersProps } from '../organisms/ListFilters';
import { ListHeader, ListHeaderProps } from '../organisms/ListHeader';

import { PageTemplate } from './Page.template';

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
  search?: SearchProps;
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
  search,
}: ListPageTemplateProps<TItem>) => {
  /**
   * Use search params as key for the ListFilters component
   * This will force react to mount again this component
   * when the search params changed
   */
  const listFiltersKey = new URLSearchParams(useSearchParams()).toString();

  return (
    <PageTemplate banner={<Heading1 className="text-theme-white">{heading}</Heading1>}>
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col gap-3 pb-2 border-solid border-0 border-b md:border-b-0 md:w-1/4">
          {actions.length ? (
            <>
              {actions.map((a) => (
                <LinkAction
                  label={a.name}
                  href={a.link}
                  key={a.link}
                  className="w-fit fr-link fr-icon-arrow-right-line fr-link--icon-right"
                />
              ))}
            </>
          ) : null}
          {search || filters.length ? (
            <Heading2 className="mt-1 mb-4">Affiner la recherche</Heading2>
          ) : null}
          {search ? <Search label={search.label} params={search.params} /> : null}
          {filters.length ? <ListFilters key={listFiltersKey} filters={filters} /> : null}
        </div>

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
