import { FC } from 'react';

import { ListFiltersProps } from '../molecules/ListFilters';
import { FiltersTagList } from '../molecules/FiltersTagList';

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
