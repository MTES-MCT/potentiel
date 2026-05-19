import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { getStatutLauréatLabel } from '@/app/_helpers/getStatutLauréatLabel';
import { optionalStringArray } from '@/app/_helpers/optionalStringArray';
import type { ListFilterItem } from '@/components/molecules/ListFilters';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToRangeOptions } from '@/utils/pagination';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DossierRaccordementListPage } from './DossierRaccordementList.page';

type PageProps = {
  searchParams?: Promise<Record<SearchParams, string>>;
};

export const metadata: Metadata = { title: 'Dossiers de raccordement' };

const searchParamsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  referenceDossier: z.string().optional(),
  appelOffre: optionalStringArray,
  identifiantGestionnaireReseau: z.string().optional(),
  avecDateMiseEnService: z.stringbool().optional(),
  statutProjet: z.enum(['actif', 'achevé', 'abandonné']).optional(),
  PPA: z.stringbool().optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const {
        identifiantGestionnaireReseau,
        appelOffre,
        avecDateMiseEnService,
        page,
        referenceDossier,
        statutProjet,
        PPA,
      } = searchParamsSchema.parse(searchParams);

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
          statutProjet: statutProjet ? [statutProjet] : undefined,
          estPartiEnPPA: PPA,
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

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut du projet',
          searchParamKey: 'statutProjet',
          options: (['actif', 'achevé', 'abandonné'] satisfies Lauréat.StatutLauréat.RawType[]).map(
            (value) => ({
              label: getStatutLauréatLabel(value),
              value,
            }),
          ),
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
      ];

      if (featureFlag.includes('PPA')) {
        filters.push({
          label: 'PPA',
          searchParamKey: 'PPA',
          options: [
            { label: 'Oui', value: 'true' },
            { label: 'Non', value: 'false' },
          ],
        });
      }

      const filteredFilters = filters.filter((filter) => filter.options.length);

      return (
        <DossierRaccordementListPage
          list={mapToPlainObject(mapToProps(dossiers))}
          filters={filteredFilters}
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
