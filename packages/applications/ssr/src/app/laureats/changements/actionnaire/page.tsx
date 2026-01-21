import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalEnumArray';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { optionalStringArray } from '../../../_helpers/optionalStringArray';

import {
  ChangementActionnaireListPage,
  ChangementActionnaireListPageProps,
} from './ChangementActionnaireList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: "Liste des demandes de changement d'actionnaire - Potentiel",
  description: "Liste des demandes de changement d'actionnaire",
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  statut: transformToOptionalEnumArray(
    z.enum(Lauréat.Actionnaire.StatutChangementActionnaire.statuts),
  ),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const changements = await mediator.send<Lauréat.Actionnaire.ListerChangementActionnaireQuery>(
        {
          type: 'Lauréat.Actionnaire.Query.ListerChangementActionnaire',
          data: {
            utilisateur: utilisateur.identifiantUtilisateur.email,
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
            statut: statut?.length
              ? statut.map(
                  (s) =>
                    Lauréat.Actionnaire.StatutChangementActionnaire.convertirEnValueType(s).statut,
                )
              : undefined,
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
          label: 'Statut',
          searchParamKey: 'statut',
          multiple: true,
          options: Lauréat.Actionnaire.StatutChangementActionnaire.statuts
            .toSorted((a, b) => a.localeCompare(b))
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return <ChangementActionnaireListPage list={mapToListProps(changements)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  readModel: Lauréat.Actionnaire.ListerChangementActionnaireReadModel,
): ChangementActionnaireListPageProps['list'] => {
  const pagination = mapToPagination(readModel.range);

  return {
    items: readModel.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      statut: mapToPlainObject(item.statut),
      miseÀJourLe: mapToPlainObject(item.miseÀJourLe),
      demandéLe: mapToPlainObject(item.demandéLe),
      nouvelActionnaire: item.nouvelActionnaire,
    })),
    pagination,
    total: readModel.total,
  };
};
