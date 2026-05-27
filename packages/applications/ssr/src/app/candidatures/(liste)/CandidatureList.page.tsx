import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import type { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import { CandidatureListItem, type CandidatureListItemProps } from './CandidatureListItem';

export type CandidatureListPageProps = {
  list: {
    items: Array<CandidatureListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  legend: ListPageTemplateProps<typeof ProjectListItem>['legend'];
  filters: ListPageTemplateProps<typeof ProjectListItem>['filters'];
  actions: ListPageTemplateProps<typeof ProjectListItem>['actions'];
};

export const CandidatureListPage: FC<CandidatureListPageProps> = ({
  list: { items: candidatures, currentPage, totalItems, itemsPerPage },
  legend,
  filters,
  actions = [],
}) => (
  <ListPageTemplate
    heading="Tous les candidats"
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
    filters={filters}
    actions={actions}
    legend={legend}
    totalItems={totalItems}
    ItemComponent={CandidatureListItem}
    search={{ label: 'Rechercher par nom ou identifiant de projet', params: 'nomProjet' }}
    items={candidatures.map((candidature) => ({
      ...candidature,
      key: IdentifiantProjet.bind(candidature.identifiantProjet).formatter(),
    }))}
  />
);
