'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { TâcheListItem, TâcheListItemProps } from '@/components/molecules/tâche/TâcheListItem';
import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPageTemplate';

export type TâcheListPageProps = {
  list: {
    items: Array<TâcheListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<typeof TâcheListItem>['filters'];
};

export const TâcheListPage: FC<TâcheListPageProps> = ({
  list: { items: tâches, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;

  const tagFilters = appelOffre
    ? [{ label: `appel d'offres : ${appelOffre}`, searchParamKey: 'appelOffre' }]
    : [];

  return (
    <ListPageTemplate
      heading="Tâches"
      actions={[]}
      items={tâches.map((tâche) => ({
        ...tâche,
        key: tâche.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={TâcheListItem}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
