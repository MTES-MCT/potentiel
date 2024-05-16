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
  const motif = searchParams.get('motif') ?? undefined;
  const cycle = searchParams.get('cycle') ?? undefined;

  const tagFilters: ListPageTemplateProps<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>['tagFilters'] =
    [];

  if (cycle) {
    tagFilters.push({
      label: `cycle d'appels d'offres : ${cycle}`,
      searchParamKey: 'cycle',
    });
  }

  if (appelOffre) {
    tagFilters.push({
      label: `appel d'offres : ${appelOffre}`,
      searchParamKey: 'appelOffre',
    });
  }

  if (motif) {
    tagFilters.push({
      label: `motif : ${motif}`,
      searchParamKey: 'motif',
    });
  }

  return (
    <ListPageTemplate
      heading="Projets en attente de garanties financières"
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
