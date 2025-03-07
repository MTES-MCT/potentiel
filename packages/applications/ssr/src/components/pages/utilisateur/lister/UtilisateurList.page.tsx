import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

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
};

export const UtilisateurListPage: FC<UtilisateurListPageProps> = ({
  list: { items, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  return (
    <ListPageTemplate
      heading="Utilisateurs"
      actions={[
        {
          name: 'Inviter un utilisateur',
          link: Routes.Utilisateur.inviter,
        },
      ]}
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
};
