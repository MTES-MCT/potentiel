'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import { Filter } from './Filter';

export type ListFilterItem<TSearchParamKey = string> = {
  label: string;
  searchParamKey: TSearchParamKey;
  defaultValue: string | undefined;
  options: Array<{
    label: string;
    value: string;
  }>;
};

export type ListFiltersProps = {
  filters: Array<ListFilterItem>;
};

export const ListFilters: FC<ListFiltersProps> = ({ filters }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // this aims at using defaultValue
  // when it is defined
  useEffect(() => {
    if (searchParams.size === 0) {
      const newSearchParams = new URLSearchParams(searchParams);
      for (const filter of filters) {
        const currentValue = searchParams.get(filter.searchParamKey);
        if (!currentValue && filter.defaultValue) {
          newSearchParams.set(filter.searchParamKey, filter.defaultValue);
        }
      }
      router.push(buildUrl(pathname, newSearchParams));
    }
  }, []);

  return (
    <div className="flex flex-col gap">
      {filters.map(({ label, searchParamKey, options }) => (
        <Filter
          key={`filter-${searchParamKey}`}
          label={label}
          options={options}
          value={searchParams.get(searchParamKey) ?? ''}
          onValueSelected={(value) => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (value === '') {
              newSearchParams.delete(searchParamKey);
            } else {
              const option = options.find((option) => option.value === value);
              if (option) {
                newSearchParams.set(searchParamKey, option.value);
              }
            }
            router.push(buildUrl(pathname, newSearchParams));
          }}
        />
      ))}
    </div>
  );
};

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
