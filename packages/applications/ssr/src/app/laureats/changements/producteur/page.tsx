import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Producteur } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import {
  ChangementProducteurListPage,
  ChangementProducteurListPageProps,
} from '@/components/pages/producteur/changement/lister/ChangementProducteurList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Liste des changements de producteur - Potentiel',
  description: 'Liste des changements de producteur',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre } = paramsSchema.parse(searchParams);

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const changements = await mediator.send<Producteur.ListerChangementProducteurQuery>({
        type: 'Lauréat.Producteur.Query.ListerChangementProducteur',
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
      ];

      return <ChangementProducteurListPage list={mapToListProps(changements)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  changements: Producteur.ListerChangementProducteurReadModel,
): ChangementProducteurListPageProps['list'] => {
  const pagination = mapToPagination(changements.range);

  return {
    items: changements.items.map((item) => ({
      identifiantProjet: mapToPlainObject(item.identifiantProjet),
      nomProjet: item.nomProjet,
      enregistréLe: mapToPlainObject(item.enregistréLe),
      ancienProducteur: item.ancienProducteur,
      nouveauProducteur: item.nouveauProducteur,
    })),
    pagination,
    total: changements.total,
  };
};
