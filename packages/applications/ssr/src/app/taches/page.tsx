import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ListerTâchesQuery } from '@potentiel-domain/tache';
import { mapToPlainObject } from '@potentiel-domain/core';

import { TâcheListPage } from '@/components/pages/tâche/TâcheList.page';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Tâches - Potentiel',
  description: 'Liste des tâches en attente',
};

export default async function Page({ searchParams }: IdentifiantParameter & PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;

      const appelOffre = searchParams?.appelOffre;

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
        },
      });

      const filters = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          defaultValue: appelOffre,
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return <TâcheListPage list={mapToPlainObject(tâches)} filters={filters} />;
    }),
  );
}
