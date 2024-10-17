import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import {
  ReprésentantLégalListItem,
  ReprésentantLégalListItemProps,
} from './ReprésentantLégalListItem';

export type ReprésentantLégalListPageProps = {
  /**
   * @todo À ajouter quand domain est prêt :
  items: PlainType<ReprésentantLégal.ListerReprésentantLégalReadModel['items']>;
   */
  items: Array<PlainType<ReprésentantLégalListItemProps>>;
  pagination: Pagination;
  total: number;
  filters: ListPageTemplateProps<typeof ReprésentantLégalListItem>['filters'];
};

export const ReprésentantLégalListPage: FC<ReprésentantLégalListPageProps> = ({
  items,
  pagination: { currentPage, itemsPerPage },
  total,
  filters,
}) => (
  <ListPageTemplate
    heading="Demande de modification du représentant légal"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter(),
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ReprésentantLégalListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
