import { FC } from 'react';
import clsx from 'clsx';

import { LinkActionProps } from '../atoms/LinkAction';
import { Heading1 } from '../atoms/headings';
import { Search, SearchProps } from '../molecules/Search';
import { List } from '../organisms/List';
import { ListFilters, ListFiltersProps } from '../molecules/ListFilters';
import { ListHeader } from '../organisms/ListHeader';
import { ListLegend, ListLegendProps } from '../molecules/ListLegend';
import { ListAction } from '../molecules/ListAction';

import { PageTemplate } from './Page.template';

export type ListPageTemplateProps<TItem> = {
  heading: string;
  filters: ListFiltersProps['filters'];
  actions: Array<LinkActionProps>;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  items: Array<TItem & { key: string }>;
  ItemComponent: FC<Omit<TItem, 'key'>>;
  search?: SearchProps;
  legend?: ListLegendProps;
  feature?: string;
};

export const ListPageTemplate = <TItem,>({
  heading,
  actions,
  ItemComponent,
  filters,
  items,
  currentPage,
  itemsPerPage,
  totalItems,
  search,
  legend = { symbols: [] },
  feature,
}: ListPageTemplateProps<TItem>) => (
  <PageTemplate feature={feature} banner={<Heading1>{heading}</Heading1>}>
    <div className="flex flex-col gap-5 md:gap-10">
      {search && (
        <div className="w-full justify-end md:w-1/3 ml-auto">
          <Search label={search.label} params={search.params} />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col gap-3 pb-2 md:w-1/4">
          {actions.length ? <ListAction actions={actions} /> : null}
          {filters.length ? <ListFilters filters={filters} /> : null}
          {legend.symbols.length ? <ListLegend symbols={legend.symbols} /> : null}
        </div>

        <div
          className={clsx(
            (actions.length || filters.length || legend.symbols.length) && 'md:w-3/4',
            'flex flex-col gap-3 flex-grow',
          )}
        >
          <ListHeader searchBarParams={search?.params} filters={filters} totalCount={totalItems} />
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
    </div>
  </PageTemplate>
);
