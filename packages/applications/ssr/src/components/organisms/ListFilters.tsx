'use client';
import { usePathname } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { Heading2 } from '../atoms/headings';
import { FC, useState } from 'react';
import { Filter } from '../molecules/Filter';

type ListFiltersProps = {
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
  const [searchParams, setSearchParams] = useState(mapToURLSearchParams(filters));
  const [url, setUrl] = useState(buildUrl(pathname, searchParams));

  return (
    <>
      <Heading2 className="mt-1 mb-6">Affiner la recherche</Heading2>
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

      <Button className="mb-4" linkProps={{ href: url }}>
        Filtrer
      </Button>
    </>
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
