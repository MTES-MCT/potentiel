import { FC } from 'react';

import {
  AbandonListItem,
  AbandonListItemProps,
} from '@/components/pages/abandon/lister/AbandonListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

export type AbandonListPageProps = {
  list: {
    items: Array<AbandonListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<typeof AbandonListItem>['filters'];
};

export const AbandonListPage: FC<AbandonListPageProps> = ({
  list: { items: abandons, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  return (
    <ListPageTemplate
      heading="Abandon"
      actions={[]}
      items={abandons.map((abandon) => ({
        ...abandon,
        key: abandon.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={AbandonListItem}
      filters={filters}
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    />
  );
};
