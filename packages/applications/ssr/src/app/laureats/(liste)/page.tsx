import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalStringArray';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';

import { LauréatListPage, LauréatListPageProps } from './LauréatList.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Projets lauréats - Potentiel',
  description: 'Liste des projets lauréats',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  statut: z.enum(Lauréat.StatutLauréat.statuts).optional(),
  appelOffre: z.string().optional(),
  periode: z.string().optional(),
  famille: z.string().optional(),
  typeActionnariat: transformToOptionalEnumArray(z.enum(Candidature.TypeActionnariat.types)),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, nomProjet, appelOffre, periode, famille, statut, typeActionnariat } =
        paramsSchema.parse(searchParams);

      const lauréats = await mediator.send<Lauréat.ListerLauréatQuery>({
        type: 'Lauréat.Query.ListerLauréat',
        data: {
          utilisateur: utilisateur.identifiantUtilisateur.email,
          nomProjet,
          appelOffre,
          periode,
          famille,
          statut,
          typeActionnariat,
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
        appelOffresFiltrée?.periodes.map(({ title, id }) => ({ label: title, value: id })) ?? [];

      const familleOptions =
        périodeFiltrée?.familles.map(({ title, id }) => ({ label: title, value: id })) ?? [];

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: 'Statut du projet',
          searchParamKey: 'statut',
          options: Lauréat.StatutLauréat.statuts.map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' '),
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
          options: getTypeActionnariatFilterOptions(appelOffresFiltrée?.cycleAppelOffre),
          multiple: true,
        },
      ];

      const legend: LauréatListPageProps['legend'] = {
        symbols: [
          { iconId: 'ri-flashlight-fill', description: 'Puissance' },
          { iconId: 'ri-money-euro-circle-line', description: 'Prix de référence' },
          { iconId: 'ri-cloud-fill', description: 'Évaluation carbone' },
        ],
      };

      return (
        <LauréatListPage
          list={mapToListProps(lauréats)}
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
  const actions: LauréatListPageProps['actions'] = [];

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

type MapToListProps = (readModel: Lauréat.ListerLauréatReadModel) => LauréatListPageProps['list'];

const mapToListProps: MapToListProps = (readModel) => {
  const items: LauréatListPageProps['list']['items'] = readModel.items.map(
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
      statut,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      statut: statut.formatter(),
      nomProjet,
      localité,
      producteur,
      puissance,
      evaluationCarboneSimplifiée,
      prixReference,
      email: email.formatter(),
      nomReprésentantLégal,
      typeActionnariat: typeActionnariat?.formatter(),
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
