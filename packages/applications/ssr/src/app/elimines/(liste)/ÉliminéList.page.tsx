import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';

import { ÉliminéListItem, ÉliminéListItemProps } from './ÉliminéListItem';

export type ÉliminéListPageProps = {
  list: {
    items: Array<ÉliminéListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  legend: ListPageTemplateProps<typeof ProjectListItem>['legend'];
  filters: ListPageTemplateProps<typeof ProjectListItem>['filters'];
  actions: ListPageTemplateProps<typeof ProjectListItem>['actions'];
};

export const ÉliminéListPage: FC<ÉliminéListPageProps> = ({
  list: { items: éliminés, currentPage, totalItems, itemsPerPage },
  legend,
  filters,
  actions,
}) => (
  <ListPageTemplate
    heading="Projets éliminés"
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
    filters={filters}
    actions={actions}
    legend={legend}
    totalItems={totalItems}
    ItemComponent={ÉliminéListItem}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    items={éliminés.map((projet) => ({
      ...projet,
      key: IdentifiantProjet.bind(projet.identifiantProjet).formatter(),
    }))}
  />
);
