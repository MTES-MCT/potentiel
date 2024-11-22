import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import {
  ChangementReprésentantLégalListItem,
  ChangementReprésentantLégalListItemProps,
} from './ChangementReprésentantLégalListItem';

export type ChangementReprésentantLégalListPageProps = {
  /**
   * @todo À ajouter quand domain est prêt :
  items: PlainType<ReprésentantLégal.ListerReprésentantLégalReadModel['items']>;
   */
  items: Array<PlainType<ChangementReprésentantLégalListItemProps>>;
  pagination: Pagination;
  total: number;
  filters: ListPageTemplateProps<typeof ChangementReprésentantLégalListItem>['filters'];
};

export const ChangementReprésentantLégalListPage: FC<ChangementReprésentantLégalListPageProps> = ({
  items,
  pagination: { currentPage, itemsPerPage },
  total,
  filters,
}) => (
  <ListPageTemplate
    heading="Changements de représentant légal"
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
