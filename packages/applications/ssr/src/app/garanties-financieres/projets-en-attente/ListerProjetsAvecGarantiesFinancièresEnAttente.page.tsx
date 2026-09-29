import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { BreadcrumbProps } from '@/utils/breadcrumb/breadcrumbContext';
import {
  ListItemProjetAvecGarantiesFinancièresEnAttente,
  type ListItemProjetAvecGarantiesFinancièresEnAttenteProps,
} from './ListItemProjetAvecGarantiesFinancièresEnAttente';

export type ListProjetsAvecGarantiesFinancièresEnAttenteProps = {
  list: {
    items: Array<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>['filters'];
  breadcrumbProps: BreadcrumbProps;
};

export const ListProjetsAvecGarantiesFinancièresEnAttentePage: FC<
  ListProjetsAvecGarantiesFinancièresEnAttenteProps
> = ({
  list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage },
  filters,
  breadcrumbProps,
}) => (
  <ListPageTemplate
    heading="Projets en attente de garanties financières"
    actions={[]}
    items={garantiesFinancières.map((gf) => ({
      ...gf,
      key: IdentifiantProjet.bind(gf.identifiantProjet).formatter(),
    }))}
    currentPage={currentPage}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    ItemComponent={ListItemProjetAvecGarantiesFinancièresEnAttente}
    filters={filters}
    breadcrumbProps={breadcrumbProps}
  />
);
