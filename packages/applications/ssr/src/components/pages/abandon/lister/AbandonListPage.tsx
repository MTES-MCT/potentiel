'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  AbandonListItem,
  AbandonListItemProps,
} from '@/components/pages/abandon/lister/AbandonListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPageTemplate';

export type AbandonListPageProps = {
  list: {
    items: Array<AbandonListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<typeof AbandonListItem>['filters'];
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
  const preuveRecandidatureStatut = searchParams.get('preuveRecandidatureStatut') ?? undefined;

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
    ...(preuveRecandidatureStatut !== undefined
      ? [
          {
            label: `preuve de recandidature ${
              preuveRecandidatureStatut === 'transmise' ? 'transmise' : 'en attente'
            }`,
            searchParamKey: 'preuveRecandidatureStatut',
          },
        ]
      : []),
  ];

  return (
    <ListPageTemplate
      heading="Abandons"
      actions={[]}
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
