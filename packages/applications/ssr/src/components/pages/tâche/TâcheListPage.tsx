'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { TâcheListItem } from '@/components/molecules/tâche/TâcheListItem';

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
