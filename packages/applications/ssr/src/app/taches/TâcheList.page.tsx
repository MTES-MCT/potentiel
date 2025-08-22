import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Tâche } from '@potentiel-domain/tache';

import { TâcheListItem } from '@/app/taches/TâcheListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

export type TâcheListPageProps = {
  list: PlainType<Tâche.ListerTâchesReadModel>;
  filters: ListPageTemplateProps<typeof TâcheListItem>['filters'];
};

export const TâcheListPage: FC<TâcheListPageProps> = ({
  list: { items: tâches, range, total },
  filters,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  return (
    <ListPageTemplate
      heading="Tâches"
      actions={[]}
      items={tâches.map((tâche) => ({
        ...tâche,
        key: IdentifiantProjet.bind(tâche.identifiantProjet).formatter(),
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={TâcheListItem}
      filters={filters}
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
    />
  );
};
