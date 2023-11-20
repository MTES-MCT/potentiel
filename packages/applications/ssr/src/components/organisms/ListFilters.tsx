'use client';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const [searchParams, setSearchParams] = useState(new URLSearchParams(useSearchParams()));

  const buildUrl = (pathname: string, searchParams: string) =>
    `${pathname}${searchParams ? `?${searchParams}` : ''}`;

  const [url, setUrl] = useState(buildUrl(pathname, searchParams.toString()));

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
            setUrl(buildUrl(pathname, searchParams.toString()));
          }}
        />
      ))}

      <Button className="mb-4" linkProps={{ href: url }}>
        Filtrer
      </Button>
    </>
  );
};
