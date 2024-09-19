'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Filter } from './Filter';

export type ListFilterItem<TSearchParamKey = string> = {
  label: string;
  searchParamKey: TSearchParamKey;
  options: Array<{
    label: string;
    value: string;
  }>;
  affects?: string;
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
      {filters.map(({ label, searchParamKey, options, affects }) => {
        const disabled = filters.some(
          (f) => f.affects === searchParamKey && !searchParams.get(f.searchParamKey),
        );

        return (
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
                if (affects && searchParams.get(affects)) {
                  newSearchParams.delete(affects);
                }
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
