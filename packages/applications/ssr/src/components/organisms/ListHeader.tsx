import { FC } from 'react';

import { ListFiltersProps } from '../molecules/ListFilters';
import { FiltersTagList } from '../molecules/FiltersTagList';

export type ListHeaderProps = {
  filters: ListFiltersProps['filters'];
  totalCount: number;
  searchBarParams?: string;
};

export const ListHeader: FC<ListHeaderProps> = ({ filters, totalCount, searchBarParams }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <FiltersTagList filters={filters} searchBarParams={searchBarParams} />
    <p className="mb-2 font-semibold text-nowrap ml-auto">Total : {totalCount}</p>
  </div>
);
