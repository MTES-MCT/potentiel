import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { TâcheListItem } from '@/app/taches/TâcheListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';
import type { SearchProps } from '../../components/molecules/Search';

export type TâcheListPageProps = {
  list: PlainType<Lauréat.Tâche.ListerTâchesReadModel>;
  filters: ListPageTemplateProps<typeof TâcheListItem>['filters'];
  search?: SearchProps | undefined;
};

export const TâcheListPage: FC<TâcheListPageProps> = ({
  list: { items: tâches, range, total },
  filters,
  search,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  return (
    <ListPageTemplate
      heading="Tâches"
      actions={[]}
      items={tâches.map((tâche) => ({
        ...tâche,
        key: IdentifiantProjet.bind(tâche.identifiantProjet).formatter() + tâche.miseÀJourLe.date,
      }))}
      currentPage={currentPage}
      totalItems={total}
      itemsPerPage={itemsPerPage}
      ItemComponent={TâcheListItem}
      filters={filters}
      search={search}
    />
  );
};
