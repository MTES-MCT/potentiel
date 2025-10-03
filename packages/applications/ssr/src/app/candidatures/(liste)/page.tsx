import { mediator } from 'mediateur';
import { Metadata } from 'next';
import z from 'zod';
import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { RangeOptions } from '@potentiel-domain/entity';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { transformToOptionalEnumArray } from '@/app/_helpers/transformToOptionalStringArray';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';
import { candidatureListLegendSymbols } from '@/components/molecules/candidature/CandidatureListLegendAndSymbols';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';

import { getCandidatureListActions } from '../_helpers/getCandidatureListActions';

import { CandidatureListPage, CandidatureListPageProps } from './CandidatureList.page';
import {
  CandidatureListItemActions,
  CandidatureListItemActionsProps,
} from './CandidatureListItemActions';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

export const metadata: Metadata = {
  title: 'Candidatures - Potentiel',
  description: 'Liste des candidatures',
};

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  statut: z.enum(Candidature.StatutCandidature.statuts).optional(),
  appelOffre: z.string().optional(),
  periode: z.string().optional(),
  famille: z.string().optional(),
  notifie: z.enum(['notifie', 'a-notifier']).optional(),
  typeActionnariat: transformToOptionalEnumArray(z.enum(Candidature.TypeActionnariat.types)),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export type CandidatureListItemProps = Array<
  Candidature.CandidaturesListItemReadModel & {
    actions: CandidatureListItemActionsProps['actions'];
  }
>;

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const { page, appelOffre, famille, nomProjet, periode, statut, notifie, typeActionnariat } =
      paramsSchema.parse(searchParams);

    const candidaturesData = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        range: mapToRangeOptions({
          currentPage: page,
          itemsPerPage: 10,
        }),
        nomProjet,
        appelOffre,
        période: periode,
        famille,
        statut,
        typeActionnariat,
        estNotifiée: match(notifie)
          .with('notifie', () => true)
          .with('a-notifier', () => false)
          .with(undefined, () => undefined)
          .exhaustive(),
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
        label: 'Statut de la candidature',
        searchParamKey: 'statut',
        options: Candidature.StatutCandidature.statuts.map((value) => ({
          label: value.charAt(0).toUpperCase() + value.slice(1),
          value,
        })),
      },
      {
        label: 'Notifié',
        searchParamKey: 'notifie',
        options: [
          { label: 'Notifié', value: 'notifie' },
          { label: 'À notifier', value: 'a-notifier' },
        ],
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

    const candidatures: CandidatureListItemProps = [];

    for (const candidature of candidaturesData.items) {
      const actions = getCandidatureListActions({
        estNotifiée: candidature.estNotifiée,
        aUneAttestation: !!candidature.attestation,
      });

      candidatures.push({
        ...candidature,
        actions,
      });
    }

    return (
      <CandidatureListPage
        list={mapToListProps({
          items: candidatures,
          range: candidaturesData.range,
          total: candidaturesData.total,
        })}
        filters={filters}
        legend={{
          symbols: candidatureListLegendSymbols,
        }}
        actions={[]}
      />
    );
  });
}

type MapToListProps = (args: {
  items: CandidatureListItemProps;
  range: RangeOptions;
  total: number;
}) => CandidatureListPageProps['list'];

const mapToListProps: MapToListProps = (readModel) => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      localité,
      evaluationCarboneSimplifiée,
      prixReference,
      nomReprésentantLégal,
      statut,
      nomCandidat,
      puissanceProductionAnnuelle,
      unitéPuissance,
      emailContact,
      typeActionnariat,
      actions,
      estNotifiée,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      statut: statut.formatter(),
      nomProjet,
      localité,
      producteur: nomCandidat,
      puissance: {
        valeur: puissanceProductionAnnuelle,
        unité: unitéPuissance.formatter(),
      },
      evaluationCarboneSimplifiée,
      prixReference,
      email: emailContact.formatter(),
      nomReprésentantLégal,
      typeActionnariat: typeActionnariat?.formatter(),
      statutBadge: (
        <>
          <StatutCandidatureBadge statut={statut.statut} />
          {estNotifiée !== undefined && <NotificationBadge estNotifié={estNotifiée} />}
        </>
      ),
      actions: (
        <CandidatureListItemActions
          identifiantProjet={identifiantProjet}
          nomProjet={nomProjet}
          actions={actions}
        />
      ),
    }),
  );

  return {
    items,
    ...mapToPagination(readModel.range),
    totalItems: readModel.total,
  };
};
