import type { FC } from 'react';

import type { RangeOptions } from '@potentiel-domain/entity';

import {
  ListPageTemplate,
  type ListPageTemplateProps,
} from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';
import {
  RéclamerProjetsListItem,
  type RéclamerProjetsListItemProps,
} from './RéclamerProjetsListItem';

export type RéclamerProjetsListPageProps = {
  filters: ListPageTemplateProps<RéclamerProjetsListItemProps>['filters'];
  projets: ReadonlyArray<RéclamerProjetsListItemProps>;
  range: RangeOptions;
  total: number;
};

export const RéclamerProjetsListPage: FC<RéclamerProjetsListPageProps> = ({
  filters,
  projets,
  range,
  total,
}) => {
  const { currentPage, itemsPerPage } = mapToPagination(range);

  return (
    <ListPageTemplate
      search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
      heading="Projets à réclamer"
      actions={[]}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={total}
      filters={filters}
      ItemComponent={RéclamerProjetsListItem}
      items={projets.map((projet) => ({
        ...projet,
        key: `${projet.identifiantProjet}`,
      }))}
    />
  );
};
