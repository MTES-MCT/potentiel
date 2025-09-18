import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { LauréatListPage, LauréatListPageProps } from './LauréatList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Projets lauréats - Potentiel',
  description: 'Liste des projets lauréats',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  appelOffre: z.string().optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre } = paramsSchema.parse(searchParams);

      const lauréats = await mediator.send<Lauréat.ListerLauréatQuery>({
        type: 'Lauréat.Query.ListerLauréat',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          nomProjet,
          appelOffre,
          range: mapToRangeOptions({
            currentPage: page,
            itemsPerPage: 10,
          }),
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
        },
      ];

      return <LauréatListPage list={mapToListProps(lauréats)} filters={filters} />;
    }),
  );
}

const mapToListProps = (
  readModel: Lauréat.ListerLauréatReadModel,
): LauréatListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      localité,
      producteur,
      puissance,
      evaluationCarboneSimplifiée,
      prixReference,
      représentantLégal,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      localité: localité.formatter(),
      producteur,
      puissance: `${puissance.valeur} ${puissance.unité}`,
      evaluationCarboneSimplifiée: `${evaluationCarboneSimplifiée} kgCO2e/kWh`,
      prixReference: `${prixReference} €`,
      représentantLégal,
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
