import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { featureFlags } from '@potentiel-applications/feature-flags';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from '@/components/pages/garanties-financières/en-attente/lister/ListerProjetsAvecGarantiesFinancièresEnAttente.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Garanties financières en attente - Potentiel',
  description: 'Liste des garanties financières en attente',
};

export default async function Page({ searchParams }: PageProps) {
  if (!featureFlags.SHOW_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;

      const projetsAvecGarantiesFinancièresEnAttente =
        await mediator.send<GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
            data: {
              utilisateur: {
                email: utilisateur.identifiantUtilisateur.email,
                rôle: utilisateur.role.nom,
              },
              ...(appelOffre && { appelOffre }),
              pagination: { page, itemsPerPage: 10 },
            },
          },
        );

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
        <ListProjetsAvecGarantiesFinancièresEnAttentePage
          list={mapToListProps(projetsAvecGarantiesFinancièresEnAttente)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = (
  readModel: GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
): ListProjetsAvecGarantiesFinancièresEnAttenteProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      nomProjet,
      appelOffre,
      période,
      famille,
      régionProjet,
      dernièreMiseÀJour,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      famille,
      régionProjet,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
    }),
  );

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
