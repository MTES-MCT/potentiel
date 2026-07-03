'use client';
import type { FC } from 'react';

import { Filter } from './filters/Filter';
import { useFilter } from './filters/useFilters';
import { MultipleSelect } from './MultipleSelect';

export type ListFilterItem<TSearchParamKey = string> = {
  label: string;
  searchParamKey: TSearchParamKey;
  multiple?: true;
  title?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  /**
   * The key of another filter affected by the value of the current filter.
   *  - the affected filter will be disabled unless current has a value
   *  - the affected filter will be removed when current changes
   **/
  affects?: TSearchParamKey[];
  /** The other filter(s) will be disabled if the current has a value  */
  mutuallyExclusiveWith?: TSearchParamKey[];
};

export type ListFiltersProps = {
  filters: Array<ListFilterItem>;
};

export const ListFilters: FC<ListFiltersProps> = ({ filters }) => {
  const { handleOnChange, searchParams } = useFilter();
  return (
    <div className="flex flex-col">
      {filters.map(
        ({ label, searchParamKey, options, affects, mutuallyExclusiveWith, multiple, title }) => {
          const disabled =
            filters.some(
              (f) =>
                f.affects?.includes(searchParamKey) &&
                searchParams.getAll(f.searchParamKey)?.length !== 1,
            ) ||
            options.length === 0 ||
            filters.some(
              (f) =>
                mutuallyExclusiveWith?.includes(f.searchParamKey) &&
                !!searchParams.get(f.searchParamKey),
            );
          const activeFilters = searchParams.getAll(searchParamKey);

          return multiple ? (
            <MultipleSelect
              key={`filter-${searchParamKey}`}
              noSearch
              noSelectAll
              label={label}
              options={options}
              selected={activeFilters}
              disabled={disabled}
              onChange={(value) => handleOnChange({ value, searchParamKey, affects, multiple })}
            />
          ) : (
            <Filter
              key={`filter-${searchParamKey}`}
              disabled={disabled}
              label={label}
              title={title}
              options={options}
              value={searchParams.get(searchParamKey) ?? ''}
              onChange={(value) =>
                handleOnChange({ value: value ? [value] : [], searchParamKey, affects })
              }
            />
          );
        },
      )}
    </div>
  );
};
