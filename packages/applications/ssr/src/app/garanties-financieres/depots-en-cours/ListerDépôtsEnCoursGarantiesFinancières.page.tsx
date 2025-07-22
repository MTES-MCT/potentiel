import { FC } from 'react';

import { Role } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemDépôtGarantiesFinancières,
  ListItemDépôtGarantiesFinancièresProps,
} from './ListItemDépôtGarantiesFinancières';

export type ListDépôtsGarantiesFinancièresProps = {
  list: {
    items: Array<ListItemDépôtGarantiesFinancièresProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemDépôtGarantiesFinancièresProps>['filters'];
  role: PlainType<Role.ValueType>;
};

export const ListDépôtsGarantiesFinancièresPage: FC<ListDépôtsGarantiesFinancièresProps> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
  role,
}) => (
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
    ItemComponent={ListItemDépôtGarantiesFinancières}
    filters={filters}
  />
);
