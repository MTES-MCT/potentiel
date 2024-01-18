'use client';

import { Routes } from '@potentiel-libraries/routes';
import { FC } from 'react';

import { GestionnaireRéseauListItem } from '@/components/molecules/réseau/gestionnaireRéseau/GestionnaireRéseauListItem';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

type GestionnaireRéseauListPageProps = {
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
    />
  );
};
