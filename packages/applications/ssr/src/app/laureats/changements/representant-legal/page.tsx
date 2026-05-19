import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { optionalStringArray, transformToOptionalEnumArray } from '@/app/_helpers';
import type { ListFilterItem } from '@/components/molecules/ListFilters';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ChangementReprésentantLégalListPage,
  type ChangementReprésentantLégalListPageProps,
} from './ChangementReprésentantLégalList.page';

type PageProps = {
  searchParams?: Promise<Record<SearchParams, string>>;
};

export const metadata: Metadata = { title: 'Changements de représentant légal' };

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: optionalStringArray,
  statut: transformToOptionalEnumArray(
    z.enum(Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.statuts),
  ),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const changements =
        await mediator.send<Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
          data: {
            utilisateur: utilisateur.identifiantUtilisateur.email,
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
            statut: statut?.length
              ? statut.map(
                  (s) =>
                    Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.convertirEnValueType(
                      s,
                    ).statut,
                )
              : undefined,
            appelOffre,
            nomProjet,
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
          options: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.statuts
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
          multiple: true,
        },
      ];

      return (
        <ChangementReprésentantLégalListPage list={mapToListProps(changements)} filters={filters} />
      );
    }),
  );
}

const mapToListProps = (
  readModel: Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalReadModel,
): ChangementReprésentantLégalListPageProps['list'] => {
  const pagination = mapToPagination(readModel.range);

  return {
    items: readModel.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      demandéLe: item.demandéLe,
      nomProjet: item.nomProjet,
      statut: mapToPlainObject(item.statut),
      miseÀJourLe: mapToPlainObject(item.miseÀJourLe),
    })),
    pagination,
    total: readModel.total,
  };
};
