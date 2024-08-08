'use client';

import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import {
  ListerProjetsListItemReadModel,
  ListerProjetsReadModel,
} from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetListItem } from '@/components/molecules/projet/ProjetListItem';
import { ListPageTemplate } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

export type CandidaturesListPageProps = PlainType<
  Omit<ListerProjetsReadModel, 'items'> & {
    items: ReadonlyArray<ListerProjetsListItemReadModel>;
  }
>;

export const CandidaturesListPage: FC<CandidaturesListPageProps> = ({
  items: candidatures,
  range,
  total,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  return (
    <ListPageTemplate
      heading="Projets"
      actions={[]}
      items={candidatures.map((candidature) => ({
        ...candidature,
        key: IdentifiantProjet.bind(candidature.identifiantProjet).formatter(),
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={ProjetListItem}
      filters={[]}
      search={{ label: 'Recherche par ID', params: 'identifiantProjet' }}
    />
  );
};
