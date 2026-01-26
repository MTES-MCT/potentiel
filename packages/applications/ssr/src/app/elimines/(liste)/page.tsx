import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect } from 'next/navigation';

import { Candidature, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';
import { projectListLegendSymbols } from '@/components/molecules/projet/liste/ProjectListLegendAndSymbols';
import { optionalStringArray } from '@/app/_helpers/optionalStringArray';

import { ÉliminéListPage, ÉliminéListPageProps } from './ÉliminéList.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Projets éliminés - Potentiel',
  description: 'Liste des projets éliminés',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  appelOffre: optionalStringArray,
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

      if (nomProjet && IdentifiantProjet.estValide(nomProjet)) {
        return redirect(Routes.Éliminé.détails(nomProjet));
      }

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

      const appelOffresFiltré = appelOffres.items.find((a) => appelOffre?.includes(a.id));

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
        <ÉliminéListPage
          list={{
            items: éliminés.items.map(mapToPlainObject),
            ...mapToPagination(éliminés.range),
            totalItems: éliminés.total,
          }}
          filters={filters}
          legend={{
            symbols: projectListLegendSymbols,
          }}
          actions={mapToActions({
            rôle: utilisateur.rôle,
            searchParams: {
              appelOffre,
              periode,
              famille,
            },
          })}
        />
      );
    }),
  );
}

type MapToActionsProps = {
  rôle: Role.ValueType;
  searchParams: {
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
  };
};

const mapToActions = ({
  rôle,
  searchParams: { appelOffre, periode, famille },
}: MapToActionsProps) => {
  const actions: ÉliminéListPageProps['actions'] = [];

  if (rôle.estGrd()) {
    return actions;
  }

  actions.push({
    label: 'Télécharger un export (format CSV)',
    href: Routes.Éliminé.exporter({
      appelOffre,
      periode,
      famille,
    }),
  });

  return actions;
};
