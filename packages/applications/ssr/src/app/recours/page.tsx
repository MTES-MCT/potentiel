import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Éliminé } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';

import { RecoursListPage } from './RecoursList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Recours - Potentiel',
  description: 'Liste des recours de projet',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: z.enum(Éliminé.Recours.StatutRecours.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const { items, range, total } = await mediator.send<Éliminé.Recours.ListerRecoursQuery>({
        type: 'Éliminé.Recours.Query.ListerRecours',
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
          options: Éliminé.Recours.StatutRecours.statuts
            .filter((statut) => statut !== 'inconnu' && statut !== 'annulé')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
      ];

      return (
        <RecoursListPage
          items={mapToPlainObject(items)}
          pagination={mapToPagination(range)}
          total={total}
          filters={filters}
        />
      );
    }),
  );
}
