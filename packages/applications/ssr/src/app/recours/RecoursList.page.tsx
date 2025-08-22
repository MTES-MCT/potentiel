import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Éliminé } from '@potentiel-domain/projet';

import { RecoursListItem } from '@/app/recours/RecoursListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { Pagination } from '@/utils/pagination';

export type RecoursListPageProps = {
  items: PlainType<Éliminé.Recours.ListerRecoursReadModel['items']>;
  pagination: Pagination;
  total: number;
  filters: ListPageTemplateProps<typeof RecoursListItem>['filters'];
};

export const RecoursListPage: FC<RecoursListPageProps> = ({
  items,
  pagination: { currentPage, itemsPerPage },
  total,
  filters,
}) => {
  return (
    <ListPageTemplate
      heading="Recours"
      actions={[]}
      items={items.map((item) => ({
        ...item,
        key: IdentifiantProjet.bind(item.identifiantProjet).formatter(),
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={RecoursListItem}
      filters={filters}
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    />
  );
};
