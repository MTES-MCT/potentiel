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
  const motif = searchParams.get('motif') ?? undefined;

  const tagFilters: ListPageTemplateProps<ListeItemDemandeMainLevéeProps>['tagFilters'] = [];

  if (motif) {
    tagFilters.push({
      label: `motif de main levée : ${motif}`,
      searchParamKey: 'motif',
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
      heading="Demandes de main levée en cours"
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
