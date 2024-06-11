'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { ListPageTemplate, ListPageTemplateProps } from '@/components/templates/ListPage.template';

import { convertMotifMainlevéeForView, convertStatutMainlevéeForView } from '../convertForView';

import { ListItemDemandeMainlevée, ListItemDemandeMainlevéeProps } from './ListItemDemandeMainevée';

export type ListeDemandeDeMainLevéeProps = {
  list: {
    items: Array<ListItemDemandeMainlevéeProps>;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ListPageTemplateProps<ListItemDemandeMainlevéeProps>['filters'];
};

export const ListeDemandeMainLevéePage: FC<ListeDemandeDeMainLevéeProps> = ({
  list: { items: mainsLevées, currentPage, totalItems, itemsPerPage },
  filters,
}) => {
  const searchParams = useSearchParams();
  const appelOffre = searchParams.get('appelOffre') ?? undefined;
  const motif = searchParams.get('motif') ?? undefined;
  const statut = searchParams.get('statut') ?? undefined;

  const tagFilters: ListPageTemplateProps<ListItemDemandeMainlevéeProps>['tagFilters'] = [];

  if (motif) {
    tagFilters.push({
      label: `motif de mainlevée : ${convertMotifMainlevéeForView(motif)}`,
      searchParamKey: 'motif',
    });
  }

  if (statut) {
    tagFilters.push({
      label: `statut de mainlevée : ${convertStatutMainlevéeForView(statut)}`,
      searchParamKey: 'statut',
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
      heading="Demandes de mainlevée en cours"
      actions={[]}
      items={mainsLevées.map((mainLevée) => ({
        ...mainLevée,
        key: mainLevée.identifiantProjet,
      }))}
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      ItemComponent={ListItemDemandeMainlevée}
      tagFilters={tagFilters}
      filters={filters}
    />
  );
};
