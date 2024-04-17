import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from '@/components/pages/garanties-financières/en-attente/lister/ListerProjetsAvecGarantiesFinancièresEnAttente.page';
import { getGarantiesFinancièresMotifLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresMotifLabel';
import { mapToRangeOptions } from '@/utils/mapToRangeOptions';
import { mapToPagination } from '@/utils/mapToPagination';
import { displayDate } from '@/utils/displayDate';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Garanties financières en attente - Potentiel',
  description: 'Liste des garanties financières en attente',
};

export default async function Page({ searchParams }: PageProps) {
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
              range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
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
          list={mapToListProps(projetsAvecGarantiesFinancièresEnAttente, utilisateur)}
          filters={filters}
        />
      );
    }),
  );
}

const mapToListProps = (
  {
    items,
    range,
    total,
  }: GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel,
  utilisateur: Utilisateur.ValueType,
): ListProjetsAvecGarantiesFinancièresEnAttenteProps['list'] => {
  const mappedItems = items.map(
    ({
      identifiantProjet,
      nomProjet,
      appelOffre,
      période,
      famille,
      motif,
      régionProjet,
      dernièreMiseÀJour,
      dateLimiteSoumission,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      famille,
      régionProjet,
      motif: getGarantiesFinancièresMotifLabel(motif.motif),
      misÀJourLe: displayDate(dernièreMiseÀJour.date.formatter()),
      dateLimiteSoumission: displayDate(dateLimiteSoumission.formatter()),
      afficherModèleMiseEnDemeure:
        dateLimiteSoumission.estAntérieurÀ(DateTime.now()) &&
        utilisateur.role.estÉgaleÀ(Role.dreal),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
