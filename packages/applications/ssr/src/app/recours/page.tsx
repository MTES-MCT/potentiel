import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Recours } from '@potentiel-domain/elimine';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import { RecoursListPage } from '@/components/pages/recours/lister/RecoursList.page';

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
  statut: z.enum(Recours.StatutRecours.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const région = await getRégionUtilisateur(utilisateur);

      const { items, range, total } = await mediator.send<Recours.ListerRecoursQuery>({
        type: 'Éliminé.Recours.Query.ListerRecours',
        data: {
          utilisateur: {
            email: utilisateur.identifiantUtilisateur.email,
            rôle: utilisateur.role.nom,
            région,
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
          options: Recours.StatutRecours.statuts
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
