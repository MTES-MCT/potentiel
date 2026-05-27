import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import z from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';

import { transformToOptionalEnumArray } from '@/app/_helpers';
import { getTypeActionnariatFilterOptions } from '@/app/_helpers/filters/getTypeActionnariatFilterOptions';
import { optionalStringArray } from '@/app/_helpers/optionalStringArray';
import { redirigerPageProjet } from '@/app/_helpers/redirigerPageProjet';
import { candidatureListLegendSymbols } from '@/components/molecules/candidature/CandidatureListLegendAndSymbols';
import type { ListFilterItem } from '@/components/molecules/ListFilters';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { instructionSchema } from '../../../utils/candidature';
import { CandidatureListPage } from './CandidatureList.page';

type PageProps = {
  searchParams?: Promise<Record<SearchParams, string>>;
};

export const metadata: Metadata = { title: 'Candidatures' };

const paramsSchema = z.object({
  page: z.coerce.number().int().optional().default(1),
  nomProjet: z.string().optional(),
  statut: instructionSchema.shape.statut.optional(),
  appelOffre: optionalStringArray,
  periode: z.string().optional(),
  famille: z.string().optional(),
  notifie: z
    .enum(['notifie', 'a-notifier'])
    .transform((val) => (val === 'notifie' ? true : val === 'a-notifier' ? false : undefined))
    .optional(),
  typeActionnariat: transformToOptionalEnumArray(z.enum(Candidature.TypeActionnariat.types)),
});

type SearchParams = keyof z.infer<typeof paramsSchema>;

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  return PageWithErrorHandling(async () => {
    const { page, appelOffre, famille, nomProjet, periode, statut, notifie, typeActionnariat } =
      paramsSchema.parse(searchParams);

    if (nomProjet) {
      redirigerPageProjet(nomProjet, Routes.Candidature.détails);
    }

    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
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
        estNotifiée: notifie,
      },
    });

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
        label: 'Statut de la candidature',
        searchParamKey: 'statut',
        options: [
          { label: 'Classé', value: Candidature.StatutCandidature.classé.formatter() },
          { label: 'Éliminé', value: Candidature.StatutCandidature.éliminé.formatter() },
        ],
      },
      {
        label: 'Statut de la notification',
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

    return (
      <CandidatureListPage
        list={{
          items: candidatures.items.map(mapToPlainObject),
          ...mapToPagination(candidatures.range),
          totalItems: candidatures.total,
        }}
        filters={filters}
        legend={{
          symbols: candidatureListLegendSymbols,
        }}
        actions={[]}
      />
    );
  });
}
