'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemProjetAvecGarantiesFinancièresEnAttente,
  ListItemProjetAvecGarantiesFinancièresEnAttenteProps,
} from './ListItemProjetAvecGarantiesFinancièresEnAttente';

export type ListProjetsAvecGarantiesFinancièresEnAttenteProps = {
  list: {
    items: Array<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>['filters'];
};

export const ListProjetsAvecGarantiesFinancièresEnAttentePage: FC<
  ListProjetsAvecGarantiesFinancièresEnAttenteProps
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
      heading="Projets avec des garanties financières en attente"
      actions={[]}
      items={garantiesFinancières.map((gf) => ({
        ...gf,
        key: gf.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemProjetAvecGarantiesFinancièresEnAttente}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
