import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { match } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import {
  DemandeDélaiListPage,
  DemandeDélaiListPageProps,
} from '@/app/laureats/changements/delai/DemandeDélaiList.page';
import { transformToOptionalStringArray } from '@/app/_helpers/transformToOptionalStringArray';
import { ListFilterItem } from '@/components/molecules/ListFilters';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Liste des demandes de délai - Potentiel',
  description: 'Liste des demandes de délai',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: transformToOptionalStringArray,
  autoriteInstructrice: z.enum(Lauréat.Délai.AutoritéCompétente.autoritésCompétentes).optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut, autoriteInstructrice } =
        paramsSchema.parse(searchParams);

      const changements = await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ListerDemandeDélai',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          statuts: statut?.length
            ? statut.map((s) => Lauréat.Délai.StatutDemandeDélai.convertirEnValueType(s).statut)
            : undefined,
          appelOffre,
          nomProjet,
          autoriteInstructrice,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut',
          searchParamKey: 'statut',
          multiple: true,
          options: Lauréat.Délai.StatutDemandeDélai.statuts
            .filter((s) => s !== 'annulé')
            .sort((a, b) => a.localeCompare(b))
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

        {
          label: 'Autorité instructrice',
          searchParamKey: 'autoriteInstructrice',
          options: Lauréat.Délai.AutoritéCompétente.autoritésCompétentes.map((autorité) => ({
            label: match(autorité)
              .with('dreal', () => 'DREAL')
              .with('dgec', () => 'DGEC')
              .exhaustive(),
            value: autorité,
          })),
        },
      ];

      return <DemandeDélaiListPage list={mapToListProps(changements)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  changements: Lauréat.Délai.ListerDemandeDélaiReadModel,
): DemandeDélaiListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map(
      ({ identifiantProjet, nomProjet, statut, misÀJourLe, demandéLe, nombreDeMois }) => ({
        identifiantProjet: mapToPlainObject(identifiantProjet),
        nomProjet,
        statut: mapToPlainObject(statut),
        misÀJourLe: mapToPlainObject(misÀJourLe),
        demandéLe: mapToPlainObject(demandéLe),
        nombreDeMois,
      }),
    ),
    pagination,
    total: changements.total,
  };
};
