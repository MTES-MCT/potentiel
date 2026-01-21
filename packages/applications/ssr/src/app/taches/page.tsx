import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { optionalStringArray } from '../_helpers/optionalStringArray';

import { TâcheListPage } from './TâcheList.page';

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  appelOffre: optionalStringArray,
  cycle: z.enum(['CRE4', 'PPE2']).optional(),
  catégorieTâche: z.string().optional(),
  nomProjet: z.string().optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Tâches - Potentiel',
  description: 'Liste des tâches en attente',
};

const catégoriesTâchesFilters = {
  abandon: "Demandes d'abandon",
  'garanties-financières': 'Garanties financières',
  raccordement: 'Raccordements',
};

export default async function Page({ searchParams }: IdentifiantParameter & PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, cycle, catégorieTâche, nomProjet } =
        searchParamsSchema.parse(searchParams);

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: { cycle },
      });

      const tâches = await mediator.send<Lauréat.Tâche.ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          range: mapToRangeOptions({
            currentPage: page,
          }),
          email: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          catégorieTâche,
          cycle,
          nomProjet,
        },
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: "Cycle d'appels d'offres",
          searchParamKey: 'cycle',
          options: [
            { label: 'PPE2', value: 'PPE2' },
            { label: 'CRE4', value: 'CRE4' },
          ],
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          multiple: true,
        },
        {
          label: `Catégorie`,
          searchParamKey: 'catégorieTâche',
          options: Object.entries(catégoriesTâchesFilters).map(([value, label]) => ({
            value,
            label,
          })),
        },
      ];

      // on retire le searchParam "appelOffre" si l'AO ne fait pas partie du cycle passé en searchParam
      if (appelOffre && cycle && !appelOffres.items.find((ao) => appelOffre.includes(ao.id))) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('appelOffre');
        redirect(`${Routes.Tache.lister}?${newSearchParams}`, RedirectType.replace);
      }

      return (
        <TâcheListPage
          list={mapToPlainObject(tâches)}
          filters={filters}
          search={{ label: 'Rechercher par nom de projet', params: 'nomProjet' }}
        />
      );
    }),
  );
}
