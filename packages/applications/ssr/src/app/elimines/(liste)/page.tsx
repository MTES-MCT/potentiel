import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { StatutProjet, Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';

import { ÉliminéListPage, ÉliminéListPageProps } from './ÉliminéList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Projets éliminés - Potentiel',
  description: 'Liste des projets éliminés',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  appelOffre: z.string().optional(),
  periode: z.string().optional(),
  famille: z.string().optional(),
  nomProjet: z.string().optional(),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, periode, famille, nomProjet } = paramsSchema.parse(searchParams);

      const éliminés = await mediator.send<Éliminé.ListerÉliminéQuery>({
        type: 'Éliminé.Query.ListerÉliminé',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          appelOffre,
          periode,
          famille,
          nomProjet,
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

      const appelOffresFiltrée = appelOffres.items.find((a) => a.id === appelOffre);

      const périodeFiltrée = appelOffresFiltrée?.periodes.find((p) => p.id === periode);

      const périodeOptions =
        appelOffresFiltrée?.periodes.map((p) => ({ label: p.title, value: p.id })) ?? [];

      const familleOptions =
        périodeFiltrée?.familles.map((f) => ({ label: f.title, value: f.id })) ?? [];

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          affects: ['periode', 'famille'],
        },
        {
          label: 'Période',
          searchParamKey: 'periode',
          options: périodeOptions,
          affects: ['famille'],
          forceDisabled: périodeOptions.length === 0 ? true : undefined,
        },
        {
          label: 'Famille',
          searchParamKey: 'famille',
          options: familleOptions,
          forceDisabled: familleOptions.length === 0 ? true : undefined,
        },
      ];

      const legend: ÉliminéListPageProps['legend'] = {
        symbols: [
          { iconId: 'ri-flashlight-fill', description: 'Puissance' },
          { iconId: 'ri-money-euro-circle-line', description: 'Prix de référence' },
          { iconId: 'ri-cloud-fill', description: 'Évaluation carbone' },
        ],
      };

      return (
        <ÉliminéListPage
          list={mapToListProps(éliminés)}
          filters={filters}
          legend={legend}
          actions={mapToActions(utilisateur.role, {
            appelOffre,
            nomProjet,
          })}
        />
      );
    }),
  );
}

const mapToActions = (
  rôle: Role.ValueType,
  searchParams: {
    appelOffre?: string;
    nomProjet?: string;
  },
) => {
  const actions: ÉliminéListPageProps['actions'] = [];

  if (rôle.estDGEC() || rôle.estDreal()) {
    actions.push({
      label: 'Télécharger un export (CSV)',
      href: Routes.Projet.exportCsv({
        appelOffreId: searchParams.appelOffre,
        nomProjet: searchParams.nomProjet,
        classement: 'classés',
      }),
      iconId: 'ri-file-excel-line',
    });
  }

  return actions;
};

type MapToListProps = (readModel: Éliminé.ListerÉliminéReadModel) => ÉliminéListPageProps['list'];

const mapToListProps: MapToListProps = (readModel) => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      localité,
      producteur,
      puissance,
      evaluationCarboneSimplifiée,
      prixReference,
      email,
      nomReprésentantLégal,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      localité: localité.formatter(),
      producteur,
      puissance: `${puissance.valeur} ${puissance.unité}`,
      evaluationCarboneSimplifiée: `${evaluationCarboneSimplifiée} kgCO2e/kWh`,
      prixReference: `${prixReference} €`,
      email: email.formatter(),
      nomReprésentantLégal,
      statut: StatutProjet.éliminé.statut,
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
