'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { AbandonListItem } from '@/components/pages/abandon/lister/AbandonListItem';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

type AbandonListPageProps = {
  list: {
    items: Array<Parameters<typeof AbandonListItem>[0]>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: Parameters<typeof ListPageTemplate>[0]['filters'];
};

export const AbandonListPage: FC<AbandonListPageProps> = ({
  list: { items: abandons, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.has('recandidature')
    ? searchParams.get('recandidature') === 'true'
    : undefined;

  const tagFilters = [
    ...(appelOffre
      ? [{ label: `appel d'offres : ${appelOffre}`, searchParamKey: 'appelOffre' }]
      : []),
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
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={AbandonListItem}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
