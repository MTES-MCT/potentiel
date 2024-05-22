'use client';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { GestionnaireRéseauListItem } from '@/components/molecules/réseau/gestionnaireRéseau/GestionnaireRéseauListItem';
import { ListPageTemplate } from '@/components/templates/ListPage.template';

export type GestionnaireRéseauListPageProps = {
  list: {
    items: Array<Parameters<typeof GestionnaireRéseauListItem>[0]>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const GestionnaireRéseauListPage: FC<GestionnaireRéseauListPageProps> = ({
  list: { items: gestionnaireRéseaux, currentPage, totalItems, itemsPerPage },
}) => {
  return (
    <ListPageTemplate
      heading="Gestionnaires réseaux"
      actions={[
        {
          name: 'Ajouter un gestionnaire',
          link: Routes.Gestionnaire.ajouter,
        },
      ]}
      items={gestionnaireRéseaux.map((gestionnaireRéseaux) => ({
        ...gestionnaireRéseaux,
        key: gestionnaireRéseaux.identifiantGestionnaireRéseau,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={GestionnaireRéseauListItem}
      filters={[]}
      tagFilters={[]}
      search={{ label: 'Recherche par raison sociale', params: 'raisonSociale' }}
    />
  );
};
