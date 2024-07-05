'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListerTâchesReadModel } from '@potentiel-domain/tache';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { TâcheListItem } from '@/components/pages/tâche/TâcheListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

export type TâcheListPageProps = {
  list: PlainType<ListerTâchesReadModel>;
  filters: ListPageTemplateProps<typeof TâcheListItem>['filters'];
};

export const TâcheListPage: FC<TâcheListPageProps> = ({
  list: { items: tâches, range, total },
  filters,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  const searchParams = useSearchParams();
  const tagFilters = filters.reduce(
    (allFilters, { searchParamKey, label, options }) => {
      const currentFilterValue = searchParams.get(searchParamKey);
      if (!currentFilterValue) {
        return allFilters;
      }
      return [
        ...allFilters,
        {
          label: `${label}: ${options.find((x) => x.value === currentFilterValue)?.label}`,
          searchParamKey,
        },
      ];
    },
    [] as { label: string; searchParamKey: string }[],
  );

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
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
