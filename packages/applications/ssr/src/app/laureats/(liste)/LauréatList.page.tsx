import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import {
  ProjectListItem,
  ProjectListItemProps,
} from '@/components/molecules/projet/liste/ProjectListItem';

export type LauréatListPageProps = {
  list: {
    items: Array<ProjectListItemProps>;
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
    ItemComponent={ProjectListItem}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    items={lauréats.map((projet) => ({
      ...projet,
      key: projet.identifiantProjet,
    }))}
  />
);
