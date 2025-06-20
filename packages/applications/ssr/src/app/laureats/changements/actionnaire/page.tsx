import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import {
  ChangementActionnaireListPage,
  ChangementActionnaireListPageProps,
} from '@/components/pages/actionnaire/changement/lister/ChangementActionnaireList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: "Liste des demandes de changement d'actionnaire - Potentiel",
  description: "Liste des demandes de changement d'actionnaire",
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: z.enum(Lauréat.Actionnaire.StatutChangementActionnaire.statuts).optional(),
});

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
            statut,
            appelOffre,
            nomProjet,
          },
        },
      );

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
          options: Lauréat.Actionnaire.StatutChangementActionnaire.statuts
            .filter((s) => s !== 'annulé')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
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
      misÀJourLe: mapToPlainObject(item.misÀJourLe),
      demandéLe: mapToPlainObject(item.demandéLe),
      nouvelActionnaire: item.nouvelActionnaire,
    })),
    pagination,
    total: readModel.total,
  };
};
