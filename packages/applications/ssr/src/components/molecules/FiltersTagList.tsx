'use client';

import { FC } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Tag from '@codegouvfr/react-dsfr/Tag';

import { ListFiltersProps } from '@/components/molecules/ListFilters';

export type FiltersTagListProps = {
  filters: ListFiltersProps['filters'];
};

type TagFilter = { searchParamKey: string; label: string; value: string; affects?: string[] };

export const FiltersTagList: FC<FiltersTagListProps> = ({ filters }) => {
  const searchParams = useSearchParams();
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
    const existingTagValues = searchParams.getAll(tagName);

    if (existingTagValues.length > 0) {
      const newTagValues = existingTagValues.filter((v) => v !== value);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(tagName, value);

      if (newTagValues.length === 0) {
        for (const affected of affects) {
          newSearchParams.delete(affected);
        }
      }

      const url = `${pathname}?${newSearchParams.toString()}`;
      return router.push(url);
    }
  };

  const onDelete = () => router.push(pathname);

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
              <Tag
                iconId="fr-icon-delete-bin-line"
                nativeButtonProps={{
                  onClick: () => onDelete(),
                }}
              >
                Effacer les filtres
              </Tag>
            </li>
          )}
        </ul>
      )}
    </>
  );
};
