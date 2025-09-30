import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';
import { candidatureListLegendSymbols } from '@/components/molecules/candidature/CandidatureListLegendAndSymbols';

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
      legend={{
        symbols: candidatureListLegendSymbols,
      }}
      filters={filters}
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    />
  );
};
