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

    currentValues.forEach((value) => {
      tagFilters.push({
        searchParamKey,
        label: `${label} : ${options.find((x) => x.value === value)?.label}`,
        value,
        affects,
      });
    });

    return tagFilters;
  }, [] as TagFilter[]);

  const onClick = (tagName: string, value: string, affects: string[]) => {
    const existingTagValues = searchParams.getAll(tagName);

    if (existingTagValues.length > 0) {
      const newTagValues = existingTagValues.filter((v) => v !== value);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(tagName);

      if (newTagValues.length === 0) {
        affects.forEach((affected) => newSearchParams.delete(affected));
      } else {
        newTagValues.forEach((value) => newSearchParams.append(tagName, value));
      }

      const url = `${pathname}?${newSearchParams.toString()}`;
      return router.push(url);
    }
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
        </ul>
      )}
    </>
  );
};
