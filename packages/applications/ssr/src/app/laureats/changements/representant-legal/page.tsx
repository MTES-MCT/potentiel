import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import {
  ChangementReprésentantLégalListPage,
  ChangementReprésentantLégalListPageProps,
} from '@/components/pages/représentant-légal/lister/ChangementReprésentantLégalList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Liste des changements de représentant légal - Potentiel',
  description: 'Liste des changements de représentant légaux de projet',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: z.enum(ReprésentantLégal.StatutChangementReprésentantLégal.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const changements =
        await mediator.send<ReprésentantLégal.ListerChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ListerChangementReprésentantLégal',
          data: {
            utilisateur: {
              email: utilisateur.identifiantUtilisateur.email,
              rôle: utilisateur.role.nom,
              régionDreal,
            },
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
            statut,
            appelOffre,
            nomProjet,
          },
        });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
        {
          label: 'Statut',
          searchParamKey: 'statut',
          options: ReprésentantLégal.StatutChangementReprésentantLégal.statuts.map((statut) => ({
            label: statut.replace('-', ' ').toLocaleLowerCase(),
            value: statut,
          })),
        },
      ];

      return (
        <ChangementReprésentantLégalListPage list={mapToListProps(changements)} filters={filters} />
      );
    }),
  );
}

const mapToListProps = (
  readModel: ReprésentantLégal.ListerChangementReprésentantLégalReadModel,
): ChangementReprésentantLégalListPageProps['list'] => {
  const pagination = mapToPagination(readModel.range);

  return {
    items: readModel.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      identifiantChangement: item.identifiantChangement,
      nomProjet: item.nomProjet,
      statut: mapToPlainObject(item.statut),
      misÀJourLe: mapToPlainObject(item.misÀJourLe),
    })),
    pagination,
    total: readModel.total,
  };
};
