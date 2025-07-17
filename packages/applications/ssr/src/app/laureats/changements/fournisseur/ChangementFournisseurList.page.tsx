import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import {
  ChangementFournisseurListItem,
  ChangementFournisseurListItemProps,
} from './ChangementFournisseurListItem';

export type ChangementFournisseurListPageProps = {
  list: {
    items: Array<ChangementFournisseurListItemProps>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof ChangementFournisseurListItem>['filters'];
};

export const ChangementFournisseurListPage: FC<ChangementFournisseurListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Fournisseur"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.enregistréLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementFournisseurListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
