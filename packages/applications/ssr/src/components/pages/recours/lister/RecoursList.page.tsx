import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Recours } from '@potentiel-domain/elimine';

import { RecoursListItem } from '@/components/pages/recours/lister/RecoursListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

export type RecoursListPageProps = {
  items: PlainType<Recours.ListerRecoursReadModel['items']>;
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
      heading="Abandons"
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
