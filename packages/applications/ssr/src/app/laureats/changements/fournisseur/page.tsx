import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';

import { optionalStringArray } from '../../../_helpers/optionalStringArray';
import { ListFilterItem } from '../../../../components/molecules/ListFilters';

import {
  ChangementFournisseurListPage,
  ChangementFournisseurListPageProps,
} from './ChangementFournisseurList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Liste des changements de fournisseur - Potentiel',
  description: 'Liste des changements de fournisseur',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre } = paramsSchema.parse(searchParams);

      const changements = await mediator.send<Lauréat.Fournisseur.ListerChangementFournisseurQuery>(
        {
          type: 'Lauréat.Fournisseur.Query.ListerChangementFournisseur',
          data: {
            utilisateur: utilisateur.identifiantUtilisateur.email,
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
            appelOffre,
            nomProjet,
          },
        },
      );

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return <ChangementFournisseurListPage list={mapToListProps(changements)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  changements: Lauréat.Fournisseur.ListerChangementFournisseurReadModel,
): ChangementFournisseurListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      enregistréLe: mapToPlainObject(item.enregistréLe),
      fournisseurs: item.fournisseurs,
      évaluationCarboneSimplifiée: item.évaluationCarboneSimplifiée,
    })),
    pagination,
    total: changements.total,
  };
};
