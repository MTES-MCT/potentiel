import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Éliminé } from '@potentiel-domain/projet';

import { RecoursListItem } from '@/components/pages/recours/lister/RecoursListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

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
