import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import { ChangementProducteurListItem } from './ChangementProducteurListItem';

export type ChangementProducteurListPageProps = {
  list: {
    items: PlainType<Lauréat.Producteur.ListerChangementProducteurReadModel['items']>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof ChangementProducteurListItem>['filters'];
};

export const ChangementProducteurListPage: FC<ChangementProducteurListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Producteur"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.enregistréLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementProducteurListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
