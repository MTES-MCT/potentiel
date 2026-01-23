import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { optionalStringArray } from '@/app/_helpers';

import {
  ChangementInstallateurListPage,
  ChangementInstallateurListPageProps,
} from './ChangementInstallateurList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: "Liste des changements d'installateur - Potentiel",
  description: "Liste des changements d'installateur",
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

      const changements =
        await mediator.send<Lauréat.Installation.ListerChangementInstallateurQuery>({
          type: 'Lauréat.Installateur.Query.ListerChangementInstallateur',
          data: {
            utilisateur: utilisateur.identifiantUtilisateur.email,
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
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
        <ChangementInstallateurListPage list={mapToListProps(changements)} filters={filters} />
      );
    }),
  );
}

const mapToListProps = (
  changements: Lauréat.Installation.ListerChangementInstallateurReadModel,
): ChangementInstallateurListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      enregistréLe: mapToPlainObject(item.enregistréLe),
      installateur: item.installateur,
    })),
    pagination,
    total: changements.total,
  };
};
