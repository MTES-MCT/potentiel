'use client';

import { FC } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Tag from '@codegouvfr/react-dsfr/Tag';

import { ListFiltersProps } from '@/components/molecules/ListFilters';

export type FiltersTagListProps = {
  filters: ListFiltersProps['filters'];
};

type TagFilter = { label: string; searchParamKey: string; affects?: string[] };

export const FiltersTagList: FC<FiltersTagListProps> = ({ filters }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tagFilters = filters.reduce((allFilters, { searchParamKey, label, options, affects }) => {
    const currentFilterValue = searchParams.get(searchParamKey);
    if (!currentFilterValue) {
      return allFilters;
    }
    return [
      ...allFilters,
      {
        label: `${label} : ${options.find((x) => x.value === currentFilterValue)?.label}`,
        searchParamKey,
        affects,
      },
    ];
  }, [] as TagFilter[]);

  const onClick = (tagName: string, affects: string[]) => {
    const newSearchParams = tagFilters.reduce((urlSearchParams, { searchParamKey }) => {
      if (searchParams.has(searchParamKey)) {
        urlSearchParams.set(searchParamKey, searchParams.get(searchParamKey) ?? '');
      }
      return urlSearchParams;
    }, new URLSearchParams());
    newSearchParams.delete(tagName);
    affects.forEach((affected) => newSearchParams.delete(affected));
    const url = `${pathname}${newSearchParams.size > 0 ? `?${newSearchParams.toString()}` : ''}`;
    router.push(url);
  };

  return (
    <>
      {tagFilters?.length > 0 && (
        <ul className="flex flex-row gap-1">
          {tagFilters.map(({ label, searchParamKey, affects }) => (
            <li key={`tagFilter-${searchParamKey}`}>
              <Tag
                dismissible
                nativeButtonProps={{
                  onClick: () => onClick(searchParamKey, affects ?? []),
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
