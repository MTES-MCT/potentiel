import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  GarantiesFinancièresDépôtsEnCoursListPage,
  GarantiesFinancièresDépôtsEnCoursListProps,
} from '@/components/pages/garanties-financières/dépôt/lister/GarantiesFinancièresDépôtsEnCoursList.page';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import { withUtilisateur } from '@/utils/withUtilisateur';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Garanties financières en cours - Potentiel',
  description: 'Liste des garanties financières en cours',
};

export default async function Page({ searchParams }: PageProps) {
  if (!process.env.FEATURE_FLAG_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;

      const dépôtsEnCoursGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            utilisateur: {
              email: utilisateur.identifiantUtilisateur.email,
              rôle: utilisateur.role.nom,
            },
            ...(appelOffre && { appelOffre }),
            pagination: { page, itemsPerPage: 10 },
          },
        });

      const appelOffres = await mediator.send<ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          defaultValue: appelOffre,
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
      ];

      return (
        <GarantiesFinancièresDépôtsEnCoursListPage
          list={mapToListProps(dépôtsEnCoursGarantiesFinancières)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = (
  readModel: GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresReadModel,
): GarantiesFinancièresDépôtsEnCoursListProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      appelOffre,
      période,
      famille,
      nomProjet,
      régionProjet,
      dépôt: { type, dateÉchéance, dernièreMiseÀJour, statut },
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      famille,
      statut: statut.statut,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      type: getGarantiesFinancièresTypeLabel(type.type),
      dateÉchéance: dateÉchéance?.formatter(),
      régionProjet,
    }),
  );

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
