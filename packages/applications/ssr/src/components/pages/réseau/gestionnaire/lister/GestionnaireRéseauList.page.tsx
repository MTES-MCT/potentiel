'use client';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';

import { GestionnaireRéseauListItem } from '@/components/molecules/réseau/gestionnaireRéseau/GestionnaireRéseauListItem';
import { ListPageTemplate } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

export type GestionnaireAvecNombreDeRaccordement =
  GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel &
    Raccordement.ConsulterNombreDeRaccordementReadModel;

export type GestionnaireRéseauListPageProps = PlainType<
  Omit<GestionnaireRéseau.ListerGestionnaireRéseauReadModel, 'items'> & {
    items: ReadonlyArray<GestionnaireAvecNombreDeRaccordement>;
  }
>;

export const GestionnaireRéseauListPage: FC<GestionnaireRéseauListPageProps> = ({
  items: gestionnaireRéseaux,
  range,
  total,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

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
        key: gestionnaireRéseaux.identifiantGestionnaireRéseau.codeEIC,
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={GestionnaireRéseauListItem}
      filters={[]}
      tagFilters={[]}
      search={{ label: 'Recherche par raison sociale', params: 'raisonSociale' }}
    />
  );
};
