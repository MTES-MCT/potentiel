'use client';

import { FC } from 'react';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

import {
  DossierRaccordementListItemProps,
  DossierRaccordementListItem,
} from './DossierRaccordementListItem';

export type DossierRaccordementListPageProps = {
  list: {
    items: Array<DossierRaccordementListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export const DossierRaccordementListPage: FC<DossierRaccordementListPageProps> = ({
  list: { items: dossiers, currentPage, totalItems, itemsPerPage },
}) => {
  return (
    <ListPageTemplate
      heading="Dossiers de raccordements"
      actions={[]}
      items={dossiers.map((dossier) => ({
        ...dossier,
        key: dossier.identifiantDossierRaccordement,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={DossierRaccordementListItem}
      tagFilters={[]}
      filters={[]}
    />
  );
};
