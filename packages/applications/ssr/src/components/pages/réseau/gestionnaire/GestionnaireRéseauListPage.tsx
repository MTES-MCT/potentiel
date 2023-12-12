'use client';

import { FC } from 'react';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { GestionnaireRéseauListItem } from '@/components/molecules/réseau/gestionnaireRéseau/GestionnaireRéseauListItem';

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
