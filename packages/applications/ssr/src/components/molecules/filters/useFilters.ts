'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { FiltersSearchParams } from '@potentiel-applications/routes';

import type { ListFilterItem } from '../ListFilters';

type HandleOnChangeProps = {
  value: Array<string>;
  searchParamKey: ListFilterItem['searchParamKey'];
  affects?: ListFilterItem['affects'];
  multiple?: ListFilterItem['multiple'];
};

export const useFilter = () => {
  const pathname = usePathname();
  const searchParams = new FiltersSearchParams(useSearchParams());
  const router = useRouter();

  const handleOnChange = ({ value, searchParamKey, affects, multiple }: HandleOnChangeProps) => {
    const newSearchParams = new FiltersSearchParams(searchParams);

    newSearchParams.delete('page');

    newSearchParams.delete(searchParamKey);
    for (const v of value) {
      newSearchParams.append(searchParamKey, v);
    }
    if (value.length === 0 || (value.length > 1 && multiple)) {
      for (const affected of affects ?? []) {
        newSearchParams.delete(affected);
      }
    }

    if (newSearchParams.size === 0) {
      return router.push(pathname, { scroll: false });
    }
    return router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };
  return { handleOnChange, searchParams };
};
