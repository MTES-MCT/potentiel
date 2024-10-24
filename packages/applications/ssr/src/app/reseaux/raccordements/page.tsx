import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Raccordement } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DossierRaccordementListPage } from '@/components/pages/réseau/raccordement/lister/DossierRaccordementList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Dossers de raccordement - Potentiel',
  description: 'Liste des dossiers de raccordement',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  appelOffre: z.string().optional(),
  identifiantGestionnaireReseau: z.string().optional(),
  dateMiseEnServiceTransmise: z.boolean().optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (_) => {
      const { identifiantGestionnaireReseau } = paramsSchema.parse(searchParams);

      const dossiers =
        await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
          type: 'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
          data: {
            identifiantGestionnaireRéseau: identifiantGestionnaireReseau ?? '17X100A100A0001A',
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
          label: 'Mise en service',
          searchParamKey: 'dateMiseEnServiceTransmise',
          options: [
            {
              label: 'Date transmise',
              value: 'true',
            },
            {
              label: 'Date non transmise',
              value: 'false',
            },
          ],
        },
      ];

      return <DossierRaccordementListPage list={mapToPlainObject(dossiers)} filters={filters} />;
    }),
  );
}
