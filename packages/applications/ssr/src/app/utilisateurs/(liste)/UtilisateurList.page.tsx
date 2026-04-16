import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import { UtilisateurListItem, UtilisateurListItemProps } from './UtilisateurListItem';

export type UtilisateurListPageProps = {
  list: {
    items: Array<UtilisateurListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<typeof UtilisateurListItem>['filters'];
  actions: ListPageTemplateProps<typeof UtilisateurListItem>['actions'];
};

export const UtilisateurListPage: FC<UtilisateurListPageProps> = ({
  list: { items, currentPage, totalItems, itemsPerPage },
  filters,
  actions,
}) => (
  <ListPageTemplate
    heading="Utilisateurs"
    actions={actions}
    items={items.map((utilisateur) => ({
      ...utilisateur,
      key: utilisateur.utilisateur.identifiantUtilisateur.email,
    }))}
    currentPage={currentPage}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    ItemComponent={UtilisateurListItem}
    filters={filters}
    search={{ label: 'Rechercher par email', params: 'identifiantUtilisateur' }}
  />
);
