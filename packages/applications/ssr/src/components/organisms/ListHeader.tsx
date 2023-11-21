'use client';
import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Tag from '@codegouvfr/react-dsfr/Tag';

type ListHeaderProps = {
  tagFilters: Array<{
    label: string;
    searchParamKey: string;
  }>;
  totalCount: number;
};

export const ListHeader: FC<ListHeaderProps> = ({ tagFilters, totalCount }) => {
  const currentSearchParams = useSearchParams();
  const searchParams = tagFilters.reduce((urlSearchParams, { searchParamKey }) => {
    if (currentSearchParams.has(searchParamKey)) {
      urlSearchParams.set(searchParamKey, currentSearchParams.get(searchParamKey) ?? '');
    }

    return urlSearchParams;
  }, new URLSearchParams());

  const pathname = usePathname();
  const router = useRouter();

  const onClick = (tagName: string) => {
    searchParams.delete(tagName);

    const url = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
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
