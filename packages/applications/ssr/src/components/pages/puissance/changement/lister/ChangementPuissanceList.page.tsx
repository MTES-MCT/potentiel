import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Puissance } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { Pagination } from '@/utils/pagination';

import { ChangementPuissanceListItem } from './ChangementPuissanceListItem';

export type ChangementPuissanceListPageProps = {
  list: {
    items: Array<
      PlainType<
        Puissance.ListerChangementPuissanceReadModel['items'][number] & {
          unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
        }
      >
    >;
    pagination: Pagination;
    total: number;
  };
  // appelOffres: string[];
  filters: ListPageTemplateProps<typeof ChangementPuissanceListItem>['filters'];
};

export const ChangementPuissanceListPage: FC<ChangementPuissanceListPageProps> = ({
  list: {
    items,
    pagination: { currentPage, itemsPerPage },
    total,
  },
  filters,
}) => (
  <ListPageTemplate
    heading="Puissance"
    actions={[]}
    items={items.map((item) => ({
      ...item,
      key: IdentifiantProjet.bind(item.identifiantProjet).formatter() + item.demandéLe.date,
    }))}
    currentPage={currentPage}
    totalItems={total}
    itemsPerPage={itemsPerPage}
    ItemComponent={ChangementPuissanceListItem}
    filters={filters}
    search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
  />
);
