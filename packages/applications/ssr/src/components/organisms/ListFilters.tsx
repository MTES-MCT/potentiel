'use client';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { Filter } from '../molecules/Filter';

export type ListFiltersProps = {
  filters: Array<{
    label: string;
    searchParamKey: string;
    defaultValue: string | undefined;
    options: Array<{
      label: string;
      value: string;
    }>;
  }>;
};

export const ListFilters: FC<ListFiltersProps> = ({ filters }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [searchParams, setSearchParams] = useState(mapToURLSearchParams(filters));
  const [url, setUrl] = useState(buildUrl(pathname, searchParams));

  useEffect(() => {
    router.push(url);
  }, [url]);

  return (
    <div className="flex flex-col gap">
      {filters.map(({ label, searchParamKey, options, defaultValue }) => (
        <Filter
          key={`filter-${searchParamKey}`}
          label={label}
          options={options}
          defaultValue={defaultValue ?? ''}
          onValueSelected={(value) => {
            if (value === '') {
              searchParams.delete(searchParamKey);
            } else {
              const option = options.find((option) => option.value === value);
              if (option) {
                searchParams.set(searchParamKey, option.value);
              }
            }
            setSearchParams(searchParams);
            setUrl(buildUrl(pathname, searchParams));
          }}
        />
      ))}
    </div>
  );
};

const mapToURLSearchParams = (filters: ListFiltersProps['filters']): URLSearchParams => {
  return filters.reduce((searchParams, filter) => {
    if (filter.defaultValue) {
      searchParams.set(filter.searchParamKey, filter.defaultValue);
    }

    return searchParams;
  }, new URLSearchParams());
};

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
