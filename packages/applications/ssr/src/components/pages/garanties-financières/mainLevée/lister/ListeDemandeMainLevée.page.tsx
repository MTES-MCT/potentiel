'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import {
  ListItemDemandeMainLevée,
  ListeItemDemandeMainLevéeProps,
} from './ListItemDemandeMainLevée';

export type ListeDemandeDeMainLevéeProps = {
  list: {
    items: Array<ListeItemDemandeMainLevéeProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListeItemDemandeMainLevéeProps>['filters'];
};

export const ListeDemandeMainLevéePage: FC<ListeDemandeDeMainLevéeProps> = ({
  list: { items: mainsLevées, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;
  const cycle = searchParams.get('cycle') ?? undefined;

  const tagFilters: ListPageTemplateProps<ListeItemDemandeMainLevéeProps>['tagFilters'] = [];

  if (cycle) {
    tagFilters.push({
      label: `cycle d'appels d'offres : ${cycle}`,
      searchParamKey: 'cycle',
    });
  }

  if (appelOffre) {
    tagFilters.push({
      label: `appel d'offres : ${appelOffre}`,
      searchParamKey: 'appelOffre',
    });
  }

  return (
    <ListPageTemplate
      heading="Mains levées en cours"
      actions={[]}
      items={mainsLevées.map((mainLevée) => ({
        ...mainLevée,
        key: mainLevée.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemDemandeMainLevée}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
