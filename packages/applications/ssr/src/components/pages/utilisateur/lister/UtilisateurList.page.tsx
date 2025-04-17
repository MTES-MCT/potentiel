import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { LinkActionProps } from '@/components/atoms/LinkAction';

import { UtilisateurListItem, UtilisateurListItemProps } from './UtilisateurListItem';

export type UtilisateurListPageProps = {
  list: {
    items: Array<UtilisateurListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<typeof UtilisateurListItem>['filters'];
  mailtoAction: LinkActionProps;
};

export const UtilisateurListPage: FC<UtilisateurListPageProps> = ({
  list: { items, currentPage, totalItems, itemsPerPage },
  filters,
  mailtoAction,
}) => {
  const actions: LinkActionProps[] = [
    {
      label: 'Inviter un utilisateur',
      href: Routes.Utilisateur.inviter,
    },
    mailtoAction,
  ];

  return (
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
};
