import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import { LauréatListItem, LauréatListItemProps } from './LauréatListItem';

export type LauréatListPageProps = {
  list: {
    items: Array<LauréatListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  legend: ListPageTemplateProps<typeof LauréatListItem>['legend'];
  filters: ListPageTemplateProps<typeof LauréatListItem>['filters'];
  actions: ListPageTemplateProps<typeof LauréatListItem>['actions'];
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
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    items={lauréats.map((projet) => ({
      ...projet,
      key: projet.identifiantProjet,
    }))}
  />
);
