import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { Pagination } from '@/utils/pagination';
import { ChangementReprésentantLégalListItem } from './ChangementReprésentantLégalListItem';

export type ChangementReprésentantLégalListPageProps = {
  list: {
    items: PlainType<Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items']>;
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
    heading="Représentant légal"
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
