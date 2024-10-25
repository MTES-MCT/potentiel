import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DossierRaccordementListPage } from '@/components/pages/réseau/raccordement/lister/DossierRaccordementList.page';
import { mapToRangeOptions } from '@/utils/pagination';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Dossers de raccordement - Potentiel',
  description: 'Liste des dossiers de raccordement',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  referenceDossier: z.string().optional(),
  appelOffre: z.string().optional(),
  identifiantGestionnaireReseau: z.string().optional(),
  avecDateMiseEnService: z
    .string()
    .optional()
    .refine((value) => value === 'true' || value === 'false' || value === undefined, {
      message: "Le paramètre avecDateMiseEnService doit être 'true' ou 'false'",
    })
    .transform((value) => (value === 'true' ? true : value === 'false' ? false : undefined)),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (_) => {
      const {
        identifiantGestionnaireReseau,
        appelOffre,
        avecDateMiseEnService,
        page,
        referenceDossier,
      } = paramsSchema.parse(searchParams);

      const dossiers = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
          appelOffre,
          avecDateMiseEnService,
          range: mapToRangeOptions({
            currentPage: page,
          }),
          référenceDossier: referenceDossier,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const listeGestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
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
          label: 'Gestionnaires réseaux',
          searchParamKey: 'identifiantGestionnaireReseau',
          options: listeGestionnaireRéseau.items.map(
            ({ raisonSociale, identifiantGestionnaireRéseau }) => ({
              label: raisonSociale,
              value: identifiantGestionnaireRéseau.formatter(),
            }),
          ),
        },
        {
          label: 'Mise en service',
          searchParamKey: 'avecDateMiseEnService',
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
