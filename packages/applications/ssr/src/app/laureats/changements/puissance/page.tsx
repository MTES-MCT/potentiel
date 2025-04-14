import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { match } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Puissance } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import {
  ChangementPuissanceListPage,
  ChangementPuissanceListPageProps,
} from '@/components/pages/puissance/changement/lister/ChangementPuissanceList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Liste des demandes de changement de puissance - Potentiel',
  description: 'Liste des demandes de changement de puissance',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
  autoriteInstructrice: z.enum(Puissance.AutoritéCompétente.autoritéCompétentes).optional(),
  statut: z.enum(Puissance.StatutChangementPuissance.statuts).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, statut, autoriteInstructrice } =
        paramsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const changements = await mediator.send<Puissance.ListerChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ListerChangementPuissance',
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
          statut,
          appelOffre,
          nomProjet,
          autoriteInstructrice,
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
          options: Puissance.StatutChangementPuissance.statuts
            .filter((s) => s !== 'annulé')
            .map((statut) => ({
              label: statut.replace('-', ' ').toLocaleLowerCase(),
              value: statut,
            })),
        },
      ];

      if (utilisateur.role.estDGEC()) {
        filters.push({
          label: 'Autorité instructrice',
          searchParamKey: 'autoriteInstructrice',
          options: Puissance.AutoritéCompétente.autoritéCompétentes.map((autorité) => ({
            label: match(autorité)
              .with('dreal', () => 'DREAL')
              .with('dgec-admin', () => 'DGEC')
              .exhaustive(),
            value: autorité,
          })),
        });
      }

      return (
        <ChangementPuissanceListPage
          list={mapToListProps(changements, appelOffres.items)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = (
  changements: Puissance.ListerChangementPuissanceReadModel,
  appelOffres: AppelOffre.ListerAppelOffreReadModel['items'],
): ChangementPuissanceListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      statut: mapToPlainObject(item.statut),
      misÀJourLe: mapToPlainObject(item.misÀJourLe),
      demandéLe: mapToPlainObject(item.demandéLe),
      nouvellePuissance: item.nouvellePuissance,
      unitéPuissance:
        appelOffres.find((ao) => ao.id === item.identifiantProjet.appelOffre)?.unitePuissance ??
        'N/A',
    })),
    pagination,
    total: changements.total,
  };
};
