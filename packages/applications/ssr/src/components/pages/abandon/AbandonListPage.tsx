'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { AbandonListItem } from '@/components/molecules/abandon/AbandonListItem';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

type AbandonListPageProps = {
  list: {
    items: Array<Parameters<typeof AbandonListItem>[0]>;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: Array<{
    label: string;
    searchParamKey: string;
    options: Array<{ label: string; value: string }>;
  }>;
};

export const AbandonListPage: FC<AbandonListPageProps> = ({
  list: { items: abandons, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffres = searchParams.get('appelOffres') ?? undefined;
  const statut = searchParams.get('statut') ?? undefined;
  const recandidature = searchParams.has('recandidature')
    ? searchParams.get('recandidature') === 'true'
    : undefined;

  const tagFilters = [
    ...(appelOffres
      ? [{ label: `appel d'offres : ${appelOffres}`, searchParamKey: 'appelOffres' }]
      : []),
    ...(statut ? [{ label: `statut : ${statut}`, searchParamKey: 'statut' }] : []),
    ...(recandidature !== undefined
      ? [
          {
            label: `${recandidature ? 'avec' : 'sans'} recandidature`,
            searchParamKey: 'recandidature',
          },
        ]
      : []),
  ];

  return (
    <ListPageTemplate
      heading="Abandon"
      items={abandons.map((abandon) => ({
        ...abandon,
        key: abandon.identifiantProjet,
      }))}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={AbandonListItem}
      tagFilters={tagFilters}
      filters={mapToListFiltersProps(filters)}
    />
  );
};
const mapToListFiltersProps = (
  filters: AbandonListPageProps['filters'],
): Parameters<typeof ListPageTemplate>[0]['filters'] => {
  return filters.map((filter) => ({
    ...filter,
    options: filter.options.map((option) => ({
      ...option,
      isSelected: (value: string) => value === option.value,
    })),
  }));
};
