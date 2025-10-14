import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect } from 'next/navigation';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalStringArray';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';
import { projectListLegendSymbols } from '@/components/molecules/projet/liste/ProjectListLegendAndSymbols';
import { getStatutLauréatLabel } from '@/app/_helpers/getStatutLauréatLabel';

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

      if (nomProjet && IdentifiantProjet.estValide(nomProjet)) {
        return redirect(Routes.Projet.details(nomProjet));
      }

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

      const appelOffresFiltré = appelOffres.items.find((a) => a.id === appelOffre);

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
          options: getTypeActionnariatFilterOptions(appelOffresFiltré?.cycleAppelOffre),
          multiple: true,
        },
      ];

      return (
        <LauréatListPage
          list={{
            items: lauréats.items.map(mapToPlainObject),
            ...mapToPagination(lauréats.range),
            totalItems: lauréats.total,
          }}
          filters={filters}
          legend={{
            symbols: projectListLegendSymbols,
          }}
          actions={mapToActions({
            rôle: utilisateur.role,
            searchParams: { appelOffre, nomProjet, statut },
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
    statut?: Lauréat.StatutLauréat.RawType;
  };
};

const mapToActions = ({
  rôle,
  searchParams: { appelOffre, nomProjet, statut },
}: MapToActionsProps) => {
  const actions: LauréatListPageProps['actions'] = [];

  if (rôle.estGrd()) {
    return actions;
  }

  actions.push({
    label: 'Télécharger un export (format CSV)',
    href: Routes.Projet.exportCsv({
      appelOffreId: appelOffre,
      nomProjet: nomProjet,
      statut: statut,
    }),
  });

  return actions;
};
