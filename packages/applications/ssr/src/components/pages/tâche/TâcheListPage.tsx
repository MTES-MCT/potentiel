'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { TâcheListItem } from '@/components/molecules/tâche/TâcheListItem';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

type AbandonListPageProps = {
  list: {
    items: Array<Parameters<typeof TâcheListItem>[0]>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: Parameters<typeof ListPageTemplate>[0]['filters'];
};

export const TâcheListPage: FC<AbandonListPageProps> = ({
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
