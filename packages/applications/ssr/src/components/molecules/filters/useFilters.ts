'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { FiltersSearchParams } from '@potentiel-applications/routes';

import type { ListFilterItem } from '../ListFilters';

type HandleOnChangeProps = {
  value: Array<string>;
  searchParamKey: ListFilterItem['searchParamKey'];
  affects?: ListFilterItem['affects'];
};

export const useFilter = () => {
  const pathname = usePathname();
  const searchParams = new FiltersSearchParams(useSearchParams());
  const router = useRouter();

  const handleOnChange = ({ value, searchParamKey, affects }: HandleOnChangeProps) => {
    const newSearchParams = new FiltersSearchParams(searchParams);

    newSearchParams.delete(searchParamKey);

    if (value.length) {
      newSearchParams.delete('page');
      for (const v of value) {
        newSearchParams.append(searchParamKey, v);
      }
    }

    if (!value.length) {
      for (const affected of affects ?? []) {
        newSearchParams.delete(affected);
      }
    }

    // cas spécifique pour appel d'offre, période et famille
    if (value.length > 1 && searchParamKey === 'appelOffre') {
      for (const affected of affects ?? []) {
        if (affected === 'periode' || affected === 'famille') {
          newSearchParams.delete(affected);
        }
      }
    }

    if (newSearchParams.size === 0) {
      return router.push(pathname, { scroll: false });
    }

    return router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };
  return { handleOnChange, searchParams };
};
