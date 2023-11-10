'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Abandon } from '@potentiel-domain/laureat';
import { AbandonListItem } from '@/components/molecules/abandon/AbandonListItem';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

type AbandonListPageProps = {
  items: Array<Parameters<typeof AbandonListItem>[0]>;
  totalItems: number;
  itemsPerPage: number;
};

export const AbandonListPage: FC<AbandonListPageProps> = ({
  items: abandons,
  totalItems,
  itemsPerPage,
}) => {
  const searchParams = useSearchParams();
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.has('recandidature')
    ? searchParams.get('recandidature') === 'true'
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
    <ListPageTemplate
      heading="Abandon"
      items={abandons.map((abandon) => ({
        ...abandon,
        key: abandon.identifiantProjet,
      }))}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={AbandonListItem}
      tagFilters={tagFilters}
      filters={filters}
    />
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
