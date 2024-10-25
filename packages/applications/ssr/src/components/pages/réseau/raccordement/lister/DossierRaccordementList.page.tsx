import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { mapToPagination } from '@/utils/pagination';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import { DossierRaccordementListItem } from './DossierRaccordementListItem';

export type DossierRaccordementListPageProps = PlainType<{
  list: Raccordement.ListerDossierRaccordementReadModel;
  filters: ListPageTemplateProps<typeof DossierRaccordementListItem>['filters'];
}>;

export const DossierRaccordementListPage: FC<DossierRaccordementListPageProps> = ({
  list: { items, range, total },
  filters,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);
  return (
    <ListPageTemplate
      heading="Dossiers de raccordement"
      actions={[]}
      items={items.map((item) => ({
        ...item,
        key: `${IdentifiantProjet.bind(item.identifiantProjet).formatter()}#${item.référenceDossier.référence}`,
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={DossierRaccordementListItem}
      filters={filters}
      search={{ label: 'Rechercher par référence de dossier', params: 'referenceDossier' }}
    />
  );
};
