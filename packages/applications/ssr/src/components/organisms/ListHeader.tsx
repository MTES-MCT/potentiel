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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const onClick = (tagName: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete(tagName);
    const url = `${pathname}${
      urlSearchParams.toString() !== '' ? `?${urlSearchParams.toString()}` : ''
    }`;
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
