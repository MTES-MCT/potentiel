'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemDépôtEnCoursGarantiesFinancières,
  ListItemDépôtEnCoursGarantiesFinancièresProps,
} from './ListItemDépôtEnCoursGarantiesFinancières';

export type ListDépôtsEnCoursGarantiesFinancièresProps = {
  list: {
    items: Array<ListItemDépôtEnCoursGarantiesFinancièresProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemDépôtEnCoursGarantiesFinancièresProps>['filters'];
};

export const ListDépôtsEnCoursGarantiesFinancièresPage: FC<
  ListDépôtsEnCoursGarantiesFinancièresProps
> = ({ list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage }, filters }) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;
  const cycle = searchParams.get('cycle') ?? undefined;

  const tagFilters: ListPageTemplateProps<ListItemDépôtEnCoursGarantiesFinancièresProps>['tagFilters'] =
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

  return (
    <ListPageTemplate
      heading="Garanties financières à traiter"
      actions={[]}
      items={garantiesFinancières.map((gf) => ({
        ...gf,
        key: gf.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemDépôtEnCoursGarantiesFinancières}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
