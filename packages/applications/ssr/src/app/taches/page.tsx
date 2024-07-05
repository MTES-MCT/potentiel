import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ListerTâchesQuery, TypeTâche } from '@potentiel-domain/tache';
import { mapToPlainObject } from '@potentiel-domain/core';

import { TâcheListPage } from '@/components/pages/tâche/TâcheList.page';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/organisms/ListFilters';

type SearchParams = 'page' | 'appelOffre' | 'catégorieTâche';

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
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;

      const appelOffre = searchParams?.appelOffre;
      const catégorieTâche = searchParams?.catégorieTâche;

      const appelOffres = await mediator.send<ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const tâches = await mediator.send<ListerTâchesQuery>({
        type: 'Tâche.Query.ListerTâches',
        data: {
          range: mapToRangeOptions({
            currentPage: page,
          }),
          email: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          typeTâches: catégorieTâche
            ? TypeTâche.types.filter((x) => x.split('.')[0] === catégorieTâche)
            : undefined,
        },
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          defaultValue: appelOffre,
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
        {
          label: `Catégorie`,
          searchParamKey: 'catégorieTâche',
          defaultValue: catégorieTâche,
          options: Object.entries(catégoriesTâchesFilters).map(([value, label]) => ({
            value,
            label,
          })),
        },
      ];

      return <TâcheListPage list={mapToPlainObject(tâches)} filters={filters} />;
    }),
  );
}
