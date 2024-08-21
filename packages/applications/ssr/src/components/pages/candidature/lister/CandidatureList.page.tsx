import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

import { CandidatureListItem, CandidatureListItemProps } from './CandidatureListItem';

export type CandidatureListPageProps = PlainType<
  Omit<Candidature.ListerCandidaturesReadModel, 'items'> & {
    items: ReadonlyArray<CandidatureListItemProps>;
    filters: ListPageTemplateProps<CandidatureListItemProps>['filters'];
  }
>;

export const CandidatureListPage: FC<CandidatureListPageProps> = ({
  items: candidatures,
  range,
  total,
  filters,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  const legend: ListPageTemplateProps<CandidatureListItemProps>['legend'] = [
    {
      iconId: 'fr-icon-map-pin-2-line',
      description: 'Localité',
    },
    {
      iconId: 'fr-icon-community-line',
      description: 'Nom du candidat',
    },
    {
      iconId: 'fr-icon-user-line',
      description: 'Représentant légal',
    },
    {
      iconId: 'fr-icon-lightbulb-line',
      description: 'Puissance',
    },
    {
      iconId: 'fr-icon-money-euro-circle-line',
      description: 'Prix de référence',
    },
    {
      iconId: 'fr-icon-cloudy-2-line',
      description: 'Évaluation carbone',
    },
  ];

  return (
    <ListPageTemplate
      heading="Tous les candidats"
      actions={[]}
      items={candidatures.map((candidature) => ({
        ...candidature,
        key: IdentifiantProjet.bind(candidature.identifiantProjet).formatter(),
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={CandidatureListItem}
      legend={legend}
      filters={filters}
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    />
  );
};
