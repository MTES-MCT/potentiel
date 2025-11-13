import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import { ChangementInstallateurListItem } from './ChangementInstallateurListItem';

export type ChangementInstallateurListPageProps = {
  list: {
    items: PlainType<Lauréat.Installation.ListerChangementInstallateurReadModel['items']>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof ChangementInstallateurListItem>['filters'];
};

export const ChangementInstallateurListPage: FC<ChangementInstallateurListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Installateur"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.enregistréLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementInstallateurListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
