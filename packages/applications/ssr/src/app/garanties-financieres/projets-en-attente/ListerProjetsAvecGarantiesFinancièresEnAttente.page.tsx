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
      filters={filters}
    />
  );
};
