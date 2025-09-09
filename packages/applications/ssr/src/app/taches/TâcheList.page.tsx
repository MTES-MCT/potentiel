import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { TâcheListItem } from '@/app/taches/TâcheListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

export type TâcheListPageProps = {
  list: PlainType<Lauréat.Tâche.ListerTâchesReadModel>;
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
