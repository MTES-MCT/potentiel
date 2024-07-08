import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemDemandeMainlevée,
  ListItemDemandeMainlevéeProps,
} from './ListItemDemandeMainlevée';

export type ListeDemandeMainlevéeProps = {
  list: {
    items: Array<ListItemDemandeMainlevéeProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemDemandeMainlevéeProps>['filters'];
};

export const ListeDemandeMainlevéePage: FC<ListeDemandeMainlevéeProps> = ({
  list: { items: mainslevées, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  return (
    <ListPageTemplate
      heading="Demandes de mainlevée en cours"
      actions={[]}
      items={mainslevées.map((mainlevée) => ({
        ...mainlevée,
        key: mainlevée.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemDemandeMainlevée}
      filters={filters}
    />
  );
};
