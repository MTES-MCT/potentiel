import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import type { ProjectListItem } from '@/components/molecules/projet/liste/ProjectListItem';
import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import type { BreadcrumbProps } from '@/utils/breadcrumb/breadcrumbContext';
import { ÉliminéListItem, type ÉliminéListItemProps } from './ÉliminéListItem';

export type ÉliminéListPageProps = {
  list: {
    items: Array<ÉliminéListItemProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  legend: ListPageTemplateProps<typeof ProjectListItem>['legend'];
  filters: ListPageTemplateProps<typeof ProjectListItem>['filters'];
  actions: ListPageTemplateProps<typeof ProjectListItem>['actions'];
  breadcrumbProps: BreadcrumbProps;
};

export const ÉliminéListPage: FC<ÉliminéListPageProps> = ({
  list: { items: éliminés, currentPage, totalItems, itemsPerPage },
  legend,
  filters,
  actions,
  breadcrumbProps,
}) => (
  <ListPageTemplate
    heading="Projets éliminés"
    currentPage={currentPage}
    itemsPerPage={itemsPerPage}
    filters={filters}
    actions={actions}
    legend={legend}
    totalItems={totalItems}
    ItemComponent={ÉliminéListItem}
    search={{ label: 'Rechercher par nom ou identifiant', params: 'search' }}
    items={éliminés.map((projet) => ({
      ...projet,
      key: IdentifiantProjet.bind(projet.identifiantProjet).formatter(),
    }))}
    breadcrumbProps={breadcrumbProps}
  />
);
