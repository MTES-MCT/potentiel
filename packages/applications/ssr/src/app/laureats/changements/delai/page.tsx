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
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalEnumArray';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { optionalStringArray } from '../../../_helpers/optionalStringArray';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Liste des demandes de délai - Potentiel',
  description: 'Liste des demandes de délai',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  statut: transformToOptionalEnumArray(z.enum(Lauréat.Délai.StatutDemandeDélai.statuts)),
  autoriteCompetente: z.enum(Lauréat.Délai.AutoritéCompétente.autoritésCompétentes).optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut, autoriteCompetente } =
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
          autoritéCompétente: autoriteCompetente,
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

        {
          label: 'Autorité compétente',
          searchParamKey: 'autoriteCompetente',
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
      ({ identifiantProjet, nomProjet, statut, miseÀJourLe, demandéLe, nombreDeMois }) => ({
        identifiantProjet: mapToPlainObject(identifiantProjet),
        nomProjet,
        statut: mapToPlainObject(statut),
        miseÀJourLe: mapToPlainObject(miseÀJourLe),
        demandéLe: mapToPlainObject(demandéLe),
        nombreDeMois,
      }),
    ),
    pagination,
    total: changements.total,
  };
};
