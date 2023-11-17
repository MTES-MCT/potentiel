'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { Heading2 } from '../atoms/headings';
import { FC, useState } from 'react';

type ListFiltersProps = {
  filters: Array<{
    label: string;
    searchParamKey: string;
    options: Array<{
      label: string;
      value: string;
      isSelected: (value: string) => boolean;
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
      {filters.map(({ label, searchParamKey, options }) => {
        const currentValue =
          searchParams && searchParams?.has(searchParamKey)
            ? searchParams.get(searchParamKey) ?? ''
            : '';

        return (
          <SelectNext
            key={`list-filter-${searchParamKey}`}
            label={label}
            placeholder={`Filtrer par ${label.toLocaleLowerCase()}`}
            nativeSelectProps={{
              onChange: (e) => {
                const value = e.currentTarget.value;

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
              },
            }}
            options={options.map(({ label, value, isSelected }) => ({
              label,
              value,
              selected: isSelected(currentValue),
            }))}
          />
        );
      })}

      <Button className="mb-4" linkProps={{ href: url }}>
        Filtrer
      </Button>
    </>
  );
};
