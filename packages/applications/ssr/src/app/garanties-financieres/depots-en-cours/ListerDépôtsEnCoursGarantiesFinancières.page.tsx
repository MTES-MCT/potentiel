import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { BreadcrumbProps } from '@/utils/breadcrumb/breadcrumbContext';
import {
  ListItemDépôtGarantiesFinancières,
  type ListItemDépôtGarantiesFinancièresProps,
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
  breadcrumbProps: BreadcrumbProps;
};

export const ListDépôtsGarantiesFinancièresPage: FC<ListDépôtsGarantiesFinancièresProps> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
  role,
  breadcrumbProps,
}) => (
  <ListPageTemplate
    heading={
      Role.bind(role).aLaPermission('garantiesFinancières.dépôt.valider')
        ? 'Garanties financières à traiter'
        : `Garanties financières à traiter par l'autorité compétente`
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
    breadcrumbProps={breadcrumbProps}
  />
);
