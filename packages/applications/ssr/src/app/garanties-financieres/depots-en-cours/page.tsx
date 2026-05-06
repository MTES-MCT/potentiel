import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { ListFilterItem } from '@/components/molecules/ListFilters';
import { getGarantiesFinancièresTypeLabel } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/getGarantiesFinancièresTypeLabel';
import { optionalStringArray } from '@/app/_helpers/optionalStringArray';

import {
  ListDépôtsGarantiesFinancièresPage,
  ListDépôtsGarantiesFinancièresProps,
} from './ListerDépôtsEnCoursGarantiesFinancières.page';

type PageProps = {
  searchParams?: Record<SearchParams, string>;
};

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  appelOffre: optionalStringArray,
  cycle: z.enum(['CRE4', 'PPE2']).optional(),
});

type SearchParams = keyof z.infer<typeof searchParamsSchema>;

export const metadata: Metadata = { title: 'Garanties financières en attente de validation' };

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { page, appelOffre, cycle } = searchParamsSchema.parse(searchParams);

      const dépôtsEnCoursGarantiesFinancières =
        await mediator.send<Lauréat.GarantiesFinancières.ListerDépôtsGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsGarantiesFinancières',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            ...(appelOffre && { appelOffre }),
            cycle,
            range: mapToRangeOptions({
              currentPage: page,
            }),
          },
        });

      const appelOffresFiltrésParCycle = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: { cycle },
      });

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: "Cycle d'appels d'offres",
          searchParamKey: 'cycle',
          options: [
            { label: 'PPE2', value: 'PPE2' },
            { label: 'CRE4', value: 'CRE4' },
          ],
        },
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffresFiltrésParCycle.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          multiple: true,
        },
      ];

      // on retire le searchParam "appelOffre" si l'AO ne fait pas partie du cycle passé en searchParam
      if (
        appelOffre?.length &&
        cycle &&
        !appelOffresFiltrésParCycle.items.find((ao) => appelOffre.includes(ao.id))
      ) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('appelOffre');
        redirect(
          `${Routes.GarantiesFinancières.dépôt.lister()}?${newSearchParams}`,
          RedirectType.replace,
        );
      }

      return (
        <ListDépôtsGarantiesFinancièresPage
          list={mapToListProps(dépôtsEnCoursGarantiesFinancières)}
          filters={filters}
          role={mapToPlainObject(utilisateur.rôle)}
        />
      );
    }),
  );
}

const mapToListProps = ({
  items,
  range,
  total,
}: Lauréat.GarantiesFinancières.ListerDépôtsGarantiesFinancièresReadModel): ListDépôtsGarantiesFinancièresProps['list'] => {
  const mappedItems = items.map(
    ({
      identifiantProjet,
      nomProjet,
      dépôt: { type, dateÉchéance, dernièreMiseÀJour },
      estPartiEnPPA,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      estPartiEnPPA,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      type: getGarantiesFinancièresTypeLabel(type.type),
      dateÉchéance: dateÉchéance?.formatter(),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
