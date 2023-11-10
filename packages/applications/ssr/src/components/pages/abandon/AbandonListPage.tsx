'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { PageTemplate } from '../../templates/PageTemplate';
import { ListHeader } from '../../molecules/ListHeader';
import { AbandonList } from '../../molecules/abandon/AbandonList';
import { ListFilters } from '../../molecules/ListFilters';
import { Abandon } from '@potentiel-domain/laureat';

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
          <ListFilters filters={filters} />
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

const filters = [
  {
    label: 'Recandidature',
    searchParamKey: 'recandidature',
    options: [
      {
        label: 'Tous',
        value: '',
        isSelected: (value: string) => value === '' || value === undefined,
      },
      {
        label: 'Avec recandidature',
        value: 'true',
        isSelected: (value: string) => value === 'true',
      },
      {
        label: 'Sans recandidature',
        value: 'false',
        isSelected: (value: string) => value === 'false',
      },
    ],
  },
  {
    label: 'Statut',
    searchParamKey: 'statut',
    options: [
      {
        label: 'Tous',
        value: '',
        isSelected: (value: string) => value === '' || value === undefined,
      },
      {
        label: Abandon.StatutAbandon.accordé.statut,
        value: Abandon.StatutAbandon.accordé.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.accordé.statut,
      },
      {
        label: Abandon.StatutAbandon.annulé.statut,
        value: Abandon.StatutAbandon.annulé.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.annulé.statut,
      },
      {
        label: Abandon.StatutAbandon.confirmationDemandée.statut,
        value: Abandon.StatutAbandon.confirmationDemandée.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.confirmationDemandée.statut,
      },
      {
        label: Abandon.StatutAbandon.confirmé.statut,
        value: Abandon.StatutAbandon.confirmé.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.confirmé.statut,
      },
      {
        label: Abandon.StatutAbandon.demandé.statut,
        value: Abandon.StatutAbandon.demandé.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.demandé.statut,
      },
      {
        label: Abandon.StatutAbandon.rejeté.statut,
        value: Abandon.StatutAbandon.rejeté.statut,
        isSelected: (value: string) => value === Abandon.StatutAbandon.rejeté.statut,
      },
    ],
  },
];
