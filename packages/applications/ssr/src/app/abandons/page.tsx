import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Abandon } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';

import {
  AbandonListPage,
  AbandonListPageProps,
} from '@/components/pages/abandon/lister/AbandonList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Abandons - Potentiel',
  description: 'Liste des abandons de projet',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  recandidature: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  statut: z.enum(Lauréat.Abandon.StatutAbandon.statuts).optional(),
  preuveRecandidatureStatut: z.enum(Abandon.StatutPreuveRecandidature.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, recandidature, nomProjet, appelOffre, statut, preuveRecandidatureStatut } =
        paramsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
        type: 'Lauréat.Abandon.Query.ListerAbandons',
        data: {
          utilisateur: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            rôle: utilisateur.role.nom,
            régionDreal,
          },
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
          recandidature,
          statut,
          appelOffre,
          preuveRecandidatureStatut,
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
          options: Lauréat.Abandon.StatutAbandon.statuts
            .filter((s) => s !== 'inconnu' && s !== 'annulé')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
        {
          label: 'Recandidature',
          searchParamKey: 'recandidature',
          options: [
            {
              label: 'Avec recandidature',
              value: 'true',
            },
            {
              label: 'Sans recandidature',
              value: 'false',
            },
          ],
        },
      ];

      if (recandidature) {
        filters.push({
          label: 'Preuve de recandidature',
          searchParamKey: 'preuveRecandidatureStatut',
          options: Abandon.StatutPreuveRecandidature.statuts
            .filter((s) => s !== 'non-applicable')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        });
      }

      return <AbandonListPage list={mapToListProps(abandons)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  readModel: Abandon.ListerAbandonReadModel,
): AbandonListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      statut: { statut },
      misÀJourLe,
      recandidature,
      preuveRecandidatureStatut: { statut: preuveRecandidatureStatut },
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      statut,
      misÀJourLe: misÀJourLe.formatter(),
      recandidature,
      preuveRecandidatureStatut,
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
