import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { Pagination } from '@/utils/pagination';
import { ChangementPuissanceListItem } from './ChangementPuissanceListItem';

export type ChangementPuissanceListPageProps = {
  list: {
    items: Array<
      PlainType<
        Lauréat.Puissance.ListerChangementPuissanceReadModel['items'][number] & {
          unitéPuissance: string;
        }
      >
    >;
    pagination: Pagination;
    total: number;
  };
  filters: ListPageTemplateProps<typeof ChangementPuissanceListItem>['filters'];
};

export const ChangementPuissanceListPage: FC<ChangementPuissanceListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Puissance"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.demandéLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementPuissanceListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
