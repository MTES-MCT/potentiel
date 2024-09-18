import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  ListDépôtsEnCoursGarantiesFinancièresPage,
  ListDépôtsEnCoursGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/dépôt/lister/ListerDépôtsEnCoursGarantiesFinancières.page';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Garanties financières en attente de validation - Potentiel',
  description: 'Liste des garanties financières en attente de validation',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;
      const cycle = searchParams?.cycle;

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const dépôtsEnCoursGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            utilisateur: {
              régionDreal,
              identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
              rôle: utilisateur.role.nom,
            },
            ...(appelOffre && { appelOffre }),
            cycle,
            range: mapToRangeOptions({
              currentPage: page,
            }),
          },
        });

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters = [
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
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return (
        <ListDépôtsEnCoursGarantiesFinancièresPage
          list={mapToListProps(dépôtsEnCoursGarantiesFinancières)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = ({
  items,
  range,
  total,
}: GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresReadModel): ListDépôtsEnCoursGarantiesFinancièresProps['list'] => {
  const mappedItems = items.map(
    ({ identifiantProjet, nomProjet, dépôt: { type, dateÉchéance, dernièreMiseÀJour } }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
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
