import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import {
  ListItemProjetAvecGarantiesFinancièresEnAttente,
  type ListItemProjetAvecGarantiesFinancièresEnAttenteProps,
} from './ListItemProjetAvecGarantiesFinancièresEnAttente';

export type ListerProjetsAvecGarantiesFinancièresEnAttenteProps = {
  list: {
    items: Array<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>['filters'];
};

export const ListerProjetsAvecGarantiesFinancièresEnAttentePage: FC<
  ListerProjetsAvecGarantiesFinancièresEnAttenteProps
> = ({ list: { items: garantiesFinancières, currentPage, totalItems, itemsPerPage }, filters }) => (
  <ListPageTemplate
    heading="Projets sans garanties financières"
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
  />
);
