'use client';

import { FC } from 'react';

import { PageTemplate } from '../../templates/PageTemplate';
import { ListHeader } from '../../molecules/ListHeader';
import { AbandonList } from '../../molecules/abandon/AbandonList';
import { useSearchParams } from 'next/navigation';

type AbandonListPageProps = Parameters<typeof AbandonList>[0];

export const AbandonListPage: FC<AbandonListPageProps> = ({ abandons }) => {
  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.has('recandidature')
    ? !!(searchParams.get('recandidature') === 'true')
    : undefined;

  const tagFilters = [
    ...(statut ? [{ label: `statut : ${statut}`, searchParamKey: 'statut' }] : []),
    ...(recandidature !== undefined
      ? [
          {
            label: `${recandidature ? 'avec' : 'sans'} recandidature`,
            searchParamKey: 'recandidature',
          },
        ]
      : []),
  ];

  return (
    <PageTemplate heading="Abandon">
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col pb-2 border-solid border-0 border-b md:border-b-0">
          {/* <AbandonListFilters /> */}
        </div>

        {abandons.items.length ? (
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <ListHeader tagFilters={tagFilters} totalCount={abandons.totalItems} />
            </div>

            <AbandonList abandons={abandons} />
          </div>
        ) : (
          <div className="flex flex-grow">Aucun abandon à afficher</div>
        )}
      </div>
    </PageTemplate>
  );
};
