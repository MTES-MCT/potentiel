import { FC } from 'react';

import { RangeOptions } from '@potentiel-domain/entity';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { mapToPagination } from '@/utils/pagination';

import { RéclamerProjetsListItemProps, RéclamerProjetsListItem } from './RéclamerProjetsListItem';

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
