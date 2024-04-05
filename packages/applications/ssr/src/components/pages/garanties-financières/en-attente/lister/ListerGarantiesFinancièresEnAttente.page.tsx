'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemGarantiesFinancièresEnAttente,
  ListItemGarantiesFinancièresEnAttenteProps,
} from './ListItemGarantiesFinancièresEnAttente';

export type ListerGarantiesFinancièresEnAttenteProps = {
  list: {
    items: Array<ListItemGarantiesFinancièresEnAttenteProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemGarantiesFinancièresEnAttenteProps>['filters'];
};

export const ListerGarantiesFinancièresEnAttentePage: FC<
  ListerGarantiesFinancièresEnAttenteProps
> = ({ list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage }, filters }) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;

  const tagFilters = [
    ...(appelOffre
      ? [
          {
            label: `appel d'offres : ${appelOffre}`,
            searchParamKey: 'appelOffre',
          },
        ]
      : []),
  ];

  return (
    <ListPageTemplate
      heading="Garanties financières en attente"
      actions={[]}
      items={garantiesFinancières.map((gf) => ({
        ...gf,
        key: gf.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemGarantiesFinancièresEnAttente}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
