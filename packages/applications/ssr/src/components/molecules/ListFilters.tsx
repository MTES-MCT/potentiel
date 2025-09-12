'use client';

import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter } from './Filter';
import { FilterMultipleChoices } from './FilterMultipleChoices';

export type ListFilterItem<TSearchParamKey = string> = {
  label: string;
  searchParamKey: TSearchParamKey;
  multiple?: true;
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
};

export type ListFiltersProps = {
  filters: Array<ListFilterItem>;
};

export const ListFilters: FC<ListFiltersProps> = ({ filters }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="flex flex-col gap">
      {filters.map(({ label, searchParamKey, options, affects, multiple }) => {
        const disabled = filters.some(
          (f) => f.affects?.includes(searchParamKey) && !searchParams.get(f.searchParamKey),
        );

        return multiple ? (
          <FilterMultipleChoices
            disabled={disabled}
            key={`filter-${searchParamKey}`}
            label={label}
            options={options}
            activeFilters={searchParams.getAll(searchParamKey)}
            onValueSelected={(value) => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete(searchParamKey);

              if (value.length === 0) {
                affects?.forEach((affected) => newSearchParams.delete(affected));
              } else {
                value.forEach((v) => {
                  newSearchParams.append(searchParamKey, v);
                });
              }
              router.push(buildUrl(pathname, newSearchParams));
            }}
          />
        ) : (
          <Filter
            disabled={disabled}
            key={`filter-${searchParamKey}`}
            label={label}
            options={options}
            value={searchParams.get(searchParamKey) ?? ''}
            onValueSelected={(value) => {
              const newSearchParams = new URLSearchParams(searchParams);
              if (value === '') {
                newSearchParams.delete(searchParamKey);
                affects?.forEach((affected) => newSearchParams.delete(affected));
              } else {
                const option = options.find((option) => option.value === value);
                if (option) {
                  newSearchParams.set(searchParamKey, option.value);
                }
              }
              router.push(buildUrl(pathname, newSearchParams));
            }}
          />
        );
      })}
    </div>
  );
};

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
