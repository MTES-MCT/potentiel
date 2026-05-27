import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import type { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import { LauréatListItem, type LauréatListItemProps } from './LauréatListItem';

export type LauréatListPageProps = {
  list: {
    items: Array<LauréatListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  legend: ListPageTemplateProps<typeof ProjectListItem>['legend'];
  filters: ListPageTemplateProps<typeof ProjectListItem>['filters'];
  actions: ListPageTemplateProps<typeof ProjectListItem>['actions'];
};

export const LauréatListPage: FC<LauréatListPageProps> = ({
  list: { items: lauréats, currentPage, totalItems, itemsPerPage },
  legend,
  filters,
  actions,
}) => (
  <ListPageTemplate
    heading="Projets lauréats"
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
    filters={filters}
    actions={actions}
    legend={legend}
    totalItems={totalItems}
    ItemComponent={LauréatListItem}
    search={{ label: 'Rechercher par nom ou identifiant', params: 'nomProjet' }}
    items={lauréats.map((projet) => ({
      ...projet,
      key: IdentifiantProjet.bind(projet.identifiantProjet).formatter(),
    }))}
  />
);
