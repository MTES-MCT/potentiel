import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { BreadcrumbProps } from '@/utils/breadcrumb/breadcrumbContext';
import type { Pagination } from '@/utils/pagination';
import { DemandeDélaiListItem, type DemandeDélaiListItemProps } from './DemandeDélaiListItem';

export type DemandeDélaiListPageProps = {
  list: {
    items: ReadonlyArray<DemandeDélaiListItemProps>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof DemandeDélaiListItem>['filters'];
  breadcrumbProps: BreadcrumbProps;
};

export const DemandeDélaiListPage: FC<DemandeDélaiListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
  breadcrumbProps,
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
    breadcrumbProps={breadcrumbProps}
  />
);
