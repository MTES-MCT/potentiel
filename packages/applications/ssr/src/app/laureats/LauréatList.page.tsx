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
  filters: ListPageTemplateProps<typeof LauréatListItem>['filters'];
};

export const LauréatListPage: FC<LauréatListPageProps> = ({
  list: { items: lauréats, currentPage, totalItems, itemsPerPage },
  filters,
}) => (
  <ListPageTemplate
    heading="Projets lauréats"
    actions={[]}
    items={lauréats.map((projet) => ({
      ...projet,
      key: projet.identifiantProjet,
    }))}
    currentPage={currentPage}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    ItemComponent={LauréatListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
