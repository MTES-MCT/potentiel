import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  DemandeChangementReprésentantLégalListItem,
  DemandeChangementReprésentantLégalListItemProps,
} from './DemandeChangementReprésentantLégalListItem';

export type DemandeChangementReprésentantLégalListPageProps = {
  items: Array<DemandeChangementReprésentantLégalListItemProps>;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  filters: ListPageTemplateProps<DemandeChangementReprésentantLégalListItemProps>['filters'];
};

export const DemandeChangementReprésentantLégalListPage: FC<
  DemandeChangementReprésentantLégalListPageProps
> = ({ items, currentPage, totalItems, itemsPerPage, filters }) => (
  <ListPageTemplate
    heading="Changements de représentant légal"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter(),
    }))}
    currentPage={currentPage}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    ItemComponent={DemandeChangementReprésentantLégalListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
