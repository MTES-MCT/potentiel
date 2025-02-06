import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import { ChangementReprésentantLégalListItem } from './ChangementReprésentantLégalListItem';

export type ChangementReprésentantLégalListPageProps = {
  list: {
    items: PlainType<ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items']>;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof ChangementReprésentantLégalListItem>['filters'];
};

export const ChangementReprésentantLégalListPage: FC<ChangementReprésentantLégalListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Demandes de changement de représentant légal"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter(),
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementReprésentantLégalListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
