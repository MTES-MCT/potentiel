import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { RedirectType, redirect } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ListerTâchesQuery } from '@potentiel-domain/tache';
import { mapToPlainObject } from '@potentiel-domain/core';

import { TâcheListPage } from '@/components/pages/tâche/TâcheList.page';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

type SearchParams = 'page' | 'appelOffre' | 'catégorieTâche' | 'cycle' | 'nomProjet';

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
      const cycle = searchParams?.cycle;
      const nomProjet = searchParams?.nomProjet;

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });
      const appelOffresPourCycle = cycle
        ? appelOffres.items.filter((ao) =>
            cycle === 'PPE2' ? ao.id.startsWith('PPE2') : !ao.id.startsWith('PPE2'),
          )
        : appelOffres.items;

      const tâches = await mediator.send<ListerTâchesQuery>({
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
          defaultValue: cycle,
          options: [
            { label: 'PPE2', value: 'PPE2' },
            { label: 'CRE4', value: 'CRE4' },
          ],
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          defaultValue: appelOffre,
          options: appelOffresPourCycle.map((appelOffre) => ({
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

      // on retire le searchParam "appelOffre" si l'AO ne fait pas partie du cycle passé en searchParam
      if (appelOffre && cycle && !appelOffresPourCycle.find((ao) => ao.id === appelOffre)) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('appelOffre');
        redirect('./taches?' + newSearchParams.toString(), RedirectType.replace);
      }

      return <TâcheListPage list={mapToPlainObject(tâches)} filters={filters} />;
    }),
  );
}
