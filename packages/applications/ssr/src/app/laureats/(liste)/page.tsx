import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import Button from '@codegouvfr/react-dsfr/Button';

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
import { projectListLegendSymbols } from '@/components/molecules/projet/liste/ProjectListLegendAndSymbols';
import { StatutLauréatBadge } from '@/components/molecules/projet/lauréat/StatutLauréatBadge';

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
          options: getTypeActionnariatFilterOptions(appelOffresFiltré?.cycleAppelOffre),
          multiple: true,
        },
      ];

      return (
        <LauréatListPage
          list={mapToListProps(lauréats)}
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
      statutBadge: <StatutLauréatBadge statut={statut.formatter()} />,
      actions: (
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: Routes.Projet.details(identifiantProjet.formatter()),
          }}
          aria-label={`Lien vers la page du projet ${nomProjet}`}
        >
          Consulter
        </Button>
      ),
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
