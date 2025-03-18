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
};

export const UtilisateurListPage: FC<UtilisateurListPageProps> = ({
  list: { items, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const actions: LinkActionProps[] = [
    {
      label: 'Inviter un utilisateur',
      href: Routes.Utilisateur.inviter,
    },
  ];
  if (totalItems > 0 && totalItems < 30) {
    actions.push({
      label: `Contacter ${totalItems} ${totalItems > 1 ? 'utilisateurs' : 'utilisateur'}`,
      href: `mailto:${items.map((item) => item.utilisateur.identifiantUtilisateur.email).join(',')}`,
      iconId: 'fr-icon-mail-line',
    });
  }
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
