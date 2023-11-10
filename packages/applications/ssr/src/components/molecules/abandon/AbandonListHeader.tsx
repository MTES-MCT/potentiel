'use client';
import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Tag from '@codegouvfr/react-dsfr/Tag';

type AbandonListHeaderProps = {
  count: number;
};

export const AbandonListHeader: FC<AbandonListHeaderProps> = ({ count }) => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.get('recandidature') ?? undefined;

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
      {statut !== undefined && (
        <Tag
          dismissible
          nativeButtonProps={{
            onClick: () => onClick('statut'),
          }}
        >
          {statut}
        </Tag>
      )}
      {recandidature !== undefined && (
        <Tag
          dismissible
          nativeButtonProps={{
            onClick: () => onClick('recandidature'),
          }}
        >
          {recandidature ? 'avec' : 'sans'} recandidature
        </Tag>
      )}
      <p className="md:ml-auto my-2 font-semibold">
        {count} abandon{count > 1 ? 's' : ''}
        {recandidature === 'true'
          ? ' avec recandidature'
          : recandidature === 'false'
          ? ' sans recandidature'
          : ''}
      </p>
    </>
  );
};
