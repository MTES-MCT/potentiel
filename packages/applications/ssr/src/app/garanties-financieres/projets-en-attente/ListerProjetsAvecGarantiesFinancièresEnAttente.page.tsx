import type { FC } from 'react';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
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
