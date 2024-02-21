'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  GarantiesFinancièresListItem,
  GarantiesFinancièresListItemProps,
} from './GarantiesFinancièresListItem';

export type GarantiesFinancieresListPageProps = {
  list: {
    items: Array<GarantiesFinancièresListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<GarantiesFinancièresListItemProps>['filters'];
};

export const GarantiesFinancièresListPage: FC<GarantiesFinancieresListPageProps> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;
  const statut = searchParams.get('statut') ?? undefined;

  const tagFilters = [
    ...(appelOffre
      ? [{ label: `appel d'offres : ${appelOffre}`, searchParamKey: 'appelOffre' }]
      : []),
    ...(statut ? [{ label: `statut : ${statut}`, searchParamKey: 'statut' }] : []),
  ];

  return (
    <ListPageTemplate
      heading="Garanties financières"
      actions={[]}
      items={garantiesFinancières.map((gf) => ({
        ...gf,
        key: gf.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={GarantiesFinancièresListItem}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
