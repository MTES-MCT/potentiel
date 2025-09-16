'use client';

import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter } from './Filter';
import MultipleSelect from './MultipleSelect';

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

type HandleOnChangeProps = {
  value?: Array<string> | string;
  searchParamKey: ListFilterItem['searchParamKey'];
  affects?: ListFilterItem['affects'];
  options: ListFilterItem['options'];
};

export const ListFilters: FC<ListFiltersProps> = ({ filters }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleOnChange = ({ value, searchParamKey, affects, options }: HandleOnChangeProps) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.delete(searchParamKey);

    // Cas undefined
    if (!value) {
      for (const affected of affects ?? []) {
        newSearchParams.delete(affected);
      }

      return router.push(buildUrl(pathname, newSearchParams));
    }

    // Cas Array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        for (const affected of affects ?? []) {
          newSearchParams.delete(affected);
        }
      } else {
        for (const v of value) {
          newSearchParams.append(searchParamKey, v);
        }
      }

      return router.push(buildUrl(pathname, newSearchParams));
    }

    // Cas string
    if (value === '') {
      for (const affected of affects ?? []) {
        newSearchParams.delete(affected);
      }
    } else {
      const option = options.find((option) => option.value === value);
      if (option) {
        newSearchParams.set(searchParamKey, option.value);
      }
    }

    return router.push(buildUrl(pathname, newSearchParams));
  };

  return (
    <div className="flex flex-col">
      {filters.map(({ label, searchParamKey, options, affects, multiple }) => {
        const disabled = filters.some(
          (f) => f.affects?.includes(searchParamKey) && !searchParams.get(f.searchParamKey),
        );
        const activeFilters = searchParams.getAll(searchParamKey);

        return multiple ? (
          <MultipleSelect
            noSearch
            noSelectAll
            label={label}
            options={options}
            selected={activeFilters}
            onChange={(value) =>
              handleOnChange({
                value,
                searchParamKey,
                affects,
                options,
              })
            }
          />
        ) : (
          <Filter
            disabled={disabled}
            key={`filter-${searchParamKey}`}
            label={label}
            options={options}
            value={searchParams.get(searchParamKey) ?? ''}
            onChange={(value) =>
              handleOnChange({
                value,
                searchParamKey,
                affects,
                options,
              })
            }
          />
        );
      })}
    </div>
  );
};

const buildUrl = (pathname: string, searchParams: URLSearchParams) =>
  `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
