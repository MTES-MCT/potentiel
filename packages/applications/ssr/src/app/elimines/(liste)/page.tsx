import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { Candidature, Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalStringArray';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';
import { projectListLegendSymbols } from '@/components/molecules/projet/liste/ProjectListLegendAndSymbols';

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
  typeActionnariat: transformToOptionalEnumArray(z.enum(Candidature.TypeActionnariat.types)),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, periode, famille, nomProjet, typeActionnariat } =
        paramsSchema.parse(searchParams);

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
          typeActionnariat,
        },
      });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const appelOffresFiltré = appelOffres.items.find((a) => a.id === appelOffre);

      const périodeFiltrée = appelOffresFiltré?.periodes.find((p) => p.id === periode);

      const périodeOptions =
        appelOffresFiltré?.periodes.map((p) => ({ label: p.title, value: p.id })) ?? [];

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
        <ÉliminéListPage
          list={mapToListProps(éliminés)}
          filters={filters}
          legend={{
            symbols: projectListLegendSymbols,
          }}
          actions={mapToActions({
            rôle: utilisateur.role,
            searchParams: { appelOffre, nomProjet },
          })}
        />
      );
    }),
  );
}

type MapToActionsProps = {
  rôle: Role.ValueType;
  searchParams: {
    appelOffre?: string;
    nomProjet?: string;
  };
};

const mapToActions = ({ rôle, searchParams: { appelOffre, nomProjet } }: MapToActionsProps) => {
  const actions: ÉliminéListPageProps['actions'] = [];

  if (rôle.estGrd()) {
    return actions;
  }

  actions.push({
    label: 'Télécharger un export (format CSV)',
    href: Routes.Projet.exportCsv({
      appelOffreId: appelOffre,
      nomProjet: nomProjet,
      statut: 'éliminé',
    }),
  });

  return actions;
};

type MapToListProps = (readModel: Éliminé.ListerÉliminéReadModel) => ÉliminéListPageProps['list'];

const mapToListProps: MapToListProps = (readModel) => {
  const items: ÉliminéListPageProps['list']['items'] = readModel.items.map(
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
      typeActionnariat,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      localité: localité.formatter(),
      producteur,
      puissance,
      evaluationCarboneSimplifiée,
      prixReference,
      email: email.formatter(),
      nomReprésentantLégal,
      typeActionnariat: typeActionnariat?.formatter(),
      statut: 'éliminé',
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
