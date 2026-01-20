import type { Metadata } from 'next';
import * as z from 'zod';
import { mediator } from 'mediateur';

import { PotentielUtilisateur } from '@potentiel-applications/request-context';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import {
  getStatutLauréatLabel,
  getTypeActionnariatFilterOptions,
  optionalStringArray,
  transformToOptionalEnumArray,
} from '../_helpers';

import { ExportPage, ExportPageProps } from './export.page';

export const metadata: Metadata = {
  title: 'Export de données - Potentiel',
  description: `Page d'export des données au format CSV`,
};

const paramsSchema = z.object({
  statut: transformToOptionalEnumArray(z.enum(Lauréat.StatutLauréat.statuts)),
  appelOffre: optionalStringArray,
  periode: z.string().optional(),
  famille: z.string().optional(),
  typeActionnariat: transformToOptionalEnumArray(z.enum(Candidature.TypeActionnariat.types)),
});

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

type SearchParams = keyof z.infer<typeof paramsSchema>;

type ParamsType = z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { appelOffre, periode, famille, statut, typeActionnariat } =
        paramsSchema.parse(searchParams);

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const appelOffresFiltré = appelOffres.items.find((a) => appelOffre?.includes(a.id));

      const périodeFiltrée = appelOffresFiltré?.periodes.find((p) => p.id === periode);

      const périodeOptions =
        appelOffresFiltré?.periodes.map(({ title, id }) => ({ label: title, value: id })) ?? [];

      const familleOptions =
        périodeFiltrée?.familles.map(({ title, id }) => ({ label: title, value: id })) ?? [];

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut du projet',
          searchParamKey: 'statut',
          options: Lauréat.StatutLauréat.statuts.map((value) => ({
            label: getStatutLauréatLabel(value),
            value,
          })),
          multiple: true,
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          multiple: true,
          affects: ['periode', 'famille'],
        },
        {
          label: 'Période',
          searchParamKey: 'periode',
          options: périodeOptions,
          affects: ['famille'],
        },
        {
          label: 'Famille',
          searchParamKey: 'famille',
          options: familleOptions,
        },
        {
          label: "Type d'actionnariat",
          searchParamKey: 'typeActionnariat',
          options: getTypeActionnariatFilterOptions(appelOffresFiltré?.cycleAppelOffre),
          multiple: true,
        },
      ];

      return (
        <ExportPage
          actions={mapToAction(utilisateur, {
            appelOffre,
            periode,
            famille,
            statut,
            typeActionnariat,
          })}
          filters={filters}
        />
      );
    }),
  );
}

type MapToAction = (
  utilisateur: PotentielUtilisateur,
  { appelOffre, famille, periode, statut, typeActionnariat }: ParamsType,
) => ExportPageProps['actions'];

const mapToAction: MapToAction = (
  utilisateur,
  { appelOffre, famille, periode, statut, typeActionnariat },
) => {
  const actions: ExportPageProps['actions'] = [];

  if (utilisateur.rôle.aLaPermission('raccordement.listerDossierRaccordement')) {
    actions.push({
      type: 'exporter-raccordement',
      label: 'Exporter les dossiers de raccordement',
      url: Routes.Raccordement.exporter({
        appelOffre,
        periode,
        famille,
        statut,
        typeActionnariat,
      }),
      description:
        'Exporter la liste des dossiers de raccordement. Un même projet peut avoir plusieurs dossiers de raccordement.',
    });
  }

  if (utilisateur.rôle.aLaPermission('lauréat.listerLauréatEnrichi')) {
    actions.push({
      type: 'lister-lauréat-enrichi',
      label: 'Exporter les lauréats',
      url: Routes.Lauréat.exporter({ appelOffre, periode, famille, statut, typeActionnariat }),
      description: 'Exporter la liste des projets lauréats',
    });
  }

  if (utilisateur.rôle.aLaPermission('éliminé.listerÉliminéEnrichi')) {
    actions.push({
      type: 'lister-éliminé-enrichi',
      label: 'Exporter les éliminés',
      url: Routes.Éliminé.exporter({ appelOffre, periode, famille, typeActionnariat }),
      description: 'Exporter la liste des projets éliminés',
    });
  }

  if (utilisateur.rôle.aLaPermission('candidature.listerDétailsFournisseur')) {
    actions.push({
      type: 'exporter-fournisseur',
      label: 'Données fournisseur à la candidature',
      url: Routes.Candidature.exporterFournisseur({
        appelOffre,
        periode,
        famille,
        typeActionnariat,
      }),
      description:
        "Exporter l'intégralité des données fournisseurs telles qu'importées à la candidature du projet, sans tenir compte des éventuelles modifications apportées au cours de la vie du projet",
    });
  }

  return actions;
};
