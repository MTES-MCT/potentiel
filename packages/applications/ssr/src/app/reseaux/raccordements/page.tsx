import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/pagination';
import { getStatutLauréatLabel } from '@/app/_helpers/getStatutLauréatLabel';

import { DossierRaccordementListPage } from './DossierRaccordementList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Dossiers de raccordement - Potentiel',
  description: 'Liste des dossiers de raccordement',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  referenceDossier: z.string().optional(),
  appelOffre: z.string().optional(),
  identifiantGestionnaireReseau: z.string().optional(),
  avecDateMiseEnService: z.stringbool().optional(),
  statutProjet: z.enum(['actif', 'achevé']).optional(),
});

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const {
        identifiantGestionnaireReseau,
        appelOffre,
        avecDateMiseEnService,
        page,
        referenceDossier,
        statutProjet,
      } = paramsSchema.parse(searchParams);

      const dossiers = await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          identifiantGestionnaireRéseau: identifiantGestionnaireReseau,
          appelOffre,
          avecDateMiseEnService,
          range: mapToRangeOptions({
            currentPage: page,
          }),
          référenceDossier: referenceDossier,
          statutProjet,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const listeGestionnaireRéseau = utilisateur.rôle.estGrd()
        ? []
        : (
            await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
              type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
              data: {},
            })
          ).items;

      const filters = [
        {
          label: 'Statut du projet',
          searchParamKey: 'statutProjet',
          options: (['actif', 'achevé'] satisfies Lauréat.StatutLauréat.RawType[]).map((value) => ({
            label: getStatutLauréatLabel(value),
            value,
          })),
        },
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
          options: listeGestionnaireRéseau.map(
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
      ].filter((filter) => filter.options.length > 0);

      return (
        <DossierRaccordementListPage
          list={mapToPlainObject(mapToProps(dossiers))}
          filters={filters}
        />
      );
    }),
  );
}

const mapToProps = (dossiers: Lauréat.Raccordement.ListerDossierRaccordementReadModel) => {
  return {
    ...dossiers,
    items: dossiers.items.map((dossier) => ({
      ...dossier,
      raisonSocialeGestionnaireRéseau: dossier.raisonSocialeGestionnaireRéseau,
    })),
  };
};
