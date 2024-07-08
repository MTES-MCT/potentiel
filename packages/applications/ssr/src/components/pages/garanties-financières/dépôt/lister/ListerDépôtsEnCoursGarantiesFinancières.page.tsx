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
      filters={filters}
    />
  );
};
