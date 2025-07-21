import { FC } from 'react';

import { Role } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

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
  role: PlainType<Role.ValueType>;
};

export const ListDépôtsEnCoursGarantiesFinancièresPage: FC<
  ListDépôtsEnCoursGarantiesFinancièresProps
> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
  role,
}) => {
  return (
    <ListPageTemplate
      heading={
        Role.bind(role).estÉgaleÀ(Role.porteur)
          ? `Garanties financières à traiter par l'autorité compétente`
          : 'Garanties financières à traiter'
      }
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
