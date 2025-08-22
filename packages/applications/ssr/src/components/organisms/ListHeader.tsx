import type { FC } from 'react';

import { FiltersTagList } from '../molecules/FiltersTagList';
import type { ListFiltersProps } from '../molecules/ListFilters';

export type ListHeaderProps = {
  filters: ListFiltersProps['filters'];
  totalCount: number;
};

export const ListHeader: FC<ListHeaderProps> = ({ filters, totalCount }) => {
  return (
    <>
      <FiltersTagList filters={filters} />
      <p className="md:ml-auto my-2 font-semibold">Total : {totalCount}</p>
    </>
  );
};
