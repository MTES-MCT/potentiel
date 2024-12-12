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
import { DemandeChangementReprésentantLégalListPage } from '@/components/pages/représentant-légal/lister/DemandeChangementReprésentantLégalList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Potentiel - Demandes changement représentant légal',
  description: 'Liste des demandes de changement de représentant légal',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  recandidature: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: z.enum(ReprésentantLégal.StatutDemandeChangementReprésentantLégal.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut } = paramsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const demandes =
        await mediator.send<ReprésentantLégal.ListerDemandeChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ListerDemandeChangementReprésentantLégal',
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
            appelOffre,
            nomProjet,
            statut,
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
          options: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.statuts
            .filter((s) => s !== 'inconnu')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
      ];

      const { currentPage, itemsPerPage } = mapToPagination(demandes.range);

      return (
        <DemandeChangementReprésentantLégalListPage
          items={demandes.items.map((demande) => ({
            identifiantProjet: demande.identifiantProjet,
            nomProjet: demande.nomProjet,
            statut: mapToPlainObject(demande.statut),
            demandéLe: mapToPlainObject(demande.demandéLe),
          }))}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={demandes.total}
          filters={filters}
        />
      );
    }),
  );
}
