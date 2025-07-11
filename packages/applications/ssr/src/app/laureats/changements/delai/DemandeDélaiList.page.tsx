import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import { DemandeDélaiListItem, DemandeDélaiListItemProps } from './DemandeDélaiListItem';

export type DemandeDélaiListPageProps = {
  list: {
    items: ReadonlyArray<DemandeDélaiListItemProps>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof DemandeDélaiListItem>['filters'];
};

export const DemandeDélaiListPage: FC<DemandeDélaiListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Délai"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.demandéLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={DemandeDélaiListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
