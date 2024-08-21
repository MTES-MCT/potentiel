'use client';
import Tag from '@codegouvfr/react-dsfr/Tag';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListFiltersProps } from '../molecules/ListFilters';

export type ListHeaderProps = {
  filters: ListFiltersProps['filters'];
  totalCount: number;
};

export const ListHeader: FC<ListHeaderProps> = ({ filters, totalCount }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tagFilters = filters.reduce(
    (allFilters, { searchParamKey, label, options }) => {
      const currentFilterValue = searchParams.get(searchParamKey);
      if (!currentFilterValue) {
        return allFilters;
      }
      return [
        ...allFilters,
        {
          label: `${label}: ${options.find((x) => x.value === currentFilterValue)?.label}`,
          searchParamKey,
        },
      ];
    },
    [] as { label: string; searchParamKey: string }[],
  );

  const onClick = (tagName: string) => {
    const newSearchParams = tagFilters.reduce((urlSearchParams, { searchParamKey }) => {
      if (searchParams.has(searchParamKey)) {
        urlSearchParams.set(searchParamKey, searchParams.get(searchParamKey) ?? '');
      }
      return urlSearchParams;
    }, new URLSearchParams());
    newSearchParams.delete(tagName);
    const url = `${pathname}${newSearchParams.size > 0 ? `?${newSearchParams.toString()}` : ''}`;
    router.push(url);
  };

  return (
    <>
      {tagFilters?.length > 0 && (
        <ul className="flex flex-row gap-1">
          {tagFilters.map(({ label, searchParamKey }) => (
            <li key={`tagFilter-${searchParamKey}`}>
              <Tag
                dismissible
                nativeButtonProps={{
                  onClick: () => onClick(searchParamKey),
                }}
              >
                {label}
              </Tag>
            </li>
          ))}
        </ul>
      )}
      <p className="md:ml-auto my-2 font-semibold">Total : {totalCount}</p>
    </>
  );
};
