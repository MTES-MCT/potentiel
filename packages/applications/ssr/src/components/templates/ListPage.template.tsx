import { FC } from 'react';

import { LinkAction, LinkActionProps } from '../atoms/LinkAction';
import { Heading1 } from '../atoms/headings';
import { Search, SearchProps } from '../molecules/Search';
import { List } from '../organisms/List';
import { ListFilters, ListFiltersProps } from '../molecules/ListFilters';
import { ListHeader } from '../organisms/ListHeader';
import { ListLegend, ListLegendProps } from '../molecules/ListLegend';

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
}: ListPageTemplateProps<TItem>) => (
  <PageTemplate banner={<Heading1 className="text-theme-white">{heading}</Heading1>}>
    <div className="flex flex-col md:flex-row gap-5 md:gap-10">
      <div className="flex flex-col gap-3 pb-2 md:w-1/4">
        {actions.length ? (
          <>
            {actions.map((a) => (
              <LinkAction key={a.href} label={a.label} href={a.href} iconId={a.iconId} />
            ))}
          </>
        ) : null}
        {filters.length ? <ListFilters filters={filters} /> : null}
        {legend.symbols.length ? <ListLegend symbols={legend.symbols} /> : null}
      </div>

      <div className="flex flex-col gap-3 flex-grow md:w-3/4">
        <div className="w-full flex justify-end">
          <div className="md:w-2/3 w-full">
            {search ? <Search label={search.label} params={search.params} /> : null}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <ListHeader filters={filters} totalCount={totalItems} />
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
