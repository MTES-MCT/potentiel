'use client';

import Tag from '@codegouvfr/react-dsfr/Tag';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';

import type { ListFiltersProps } from '@/components/molecules/ListFilters';
import { FiltersSearchParams } from '@/utils/searchParams';

export type FiltersTagListProps = {
  filters: ListFiltersProps['filters'];
  searchBarParams?: string;
};

type TagFilter = { searchParamKey: string; label: string; value: string; affects?: string[] };

export const FiltersTagList: FC<FiltersTagListProps> = ({ filters, searchBarParams }) => {
  const searchParams = new FiltersSearchParams(useSearchParams());
  const pathname = usePathname();
  const router = useRouter();

  const tagFilters = filters.reduce((tagFilters, { searchParamKey, label, options, affects }) => {
    const currentValues = searchParams.getAll(searchParamKey);

    if (currentValues.length === 0) {
      return tagFilters;
    }

    for (const value of currentValues) {
      tagFilters.push({
        searchParamKey,
        label: `${label} : ${options.find((x) => x.value === value)?.label}`,
        value,
        affects,
      });
    }

    return tagFilters;
  }, [] as TagFilter[]);

  const onClick = (tagName: string, value: string, affects: string[]) => {
    const newSearchParams = new FiltersSearchParams(searchParams.toString());
    newSearchParams.deleteOne(tagName, value);
    newSearchParams.delete('page');

    if (newSearchParams.getAll(tagName).length === 0) {
      for (const affected of affects) {
        newSearchParams.delete(affected);
      }
    }
    const url = `${pathname}?${newSearchParams.toString()}`;
    return router.push(url);
  };
  const onDelete = () => {
    const newSearchParams = new URLSearchParams();

    if (searchBarParams) {
      const existingBarSearchValue = searchParams.get(searchBarParams);
      if (existingBarSearchValue) {
        newSearchParams.set(searchBarParams, existingBarSearchValue);
      }
    }

    const url = `${pathname}?${newSearchParams.toString()}`;
    router.push(url);
  };

  return (
    <>
      {tagFilters?.length > 0 && (
        <ul className="flex flex-row flex-wrap gap-1">
          {tagFilters.map(({ searchParamKey, label, value, affects }) => (
            <li key={`tagFilter-${searchParamKey}-${value}`}>
              <Tag
                dismissible
                nativeButtonProps={{
                  onClick: () => onClick(searchParamKey, value, affects ?? []),
                }}
              >
                {label}
              </Tag>
            </li>
          ))}
          {tagFilters?.length > 1 && (
            <li key="tagFilter-delete">
              <DeleteEveryFilterButton onDelete={onDelete} />
            </li>
          )}
        </ul>
      )}
    </>
  );
};

const DeleteEveryFilterButton = ({ onDelete }: { onDelete: () => void }) => (
  <Tag
    iconId="fr-icon-delete-bin-line"
    nativeButtonProps={{
      onClick: () => onDelete(),
    }}
  >
    Effacer les filtres
  </Tag>
);
