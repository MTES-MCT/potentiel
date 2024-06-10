import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { MotifDemandeMainLevéeGarantiesFinancières } from '@potentiel-domain/laureat/src/garantiesFinancières';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions } from '@/utils/mapToRangeOptions';
import { mapToPagination } from '@/utils/mapToPagination';

import {
  ListeDemandeDeMainLevéeProps,
  ListeDemandeMainLevéePage,
} from '../../../components/pages/garanties-financières/mainLevée/lister/ListeDemandeMainLevée.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Demande de main levée des garanties financières',
  description: 'Liste des demandes de main levée des garanties financières',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;
      const motif = searchParams?.motif;

      const demandeDeMainLevéeDesGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ListerDemandeMainLevéeQuery>({
          type: 'Lauréat.GarantiesFinancières.MainLevée.Query.Lister',
          data: {
            utilisateur: {
              email: utilisateur.identifiantUtilisateur.email,
              rôle: utilisateur.role.nom,
            },
            ...(appelOffre && { appelOffre }),
            ...(motif && {
              motif: MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motif).motif,
            }),
            range: mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 10,
            }),
          },
        });

      const appelOffres = await mediator.send<ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters = [
        {
          label: 'Motif de main levée',
          searchParamKey: 'motif',
          defaultValue: motif,
          options: [
            { label: 'Projet abandonnée', value: 'projet-abandonné' },
            { label: 'Projet achevé', value: 'projet-achevé' },
          ],
        },
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
        <ListeDemandeMainLevéePage
          list={mapToListProps(demandeDeMainLevéeDesGarantiesFinancières)}
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
}: GarantiesFinancières.ListerDemandeMainLevéeReadModel): ListeDemandeDeMainLevéeProps['list'] => {
  const mappedItems = items.map(
    ({ identifiantProjet, nomProjet, demande, motif, statut, dernièreMiseÀJour }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      statut: statut.statut,
      demandéLe: demande.demandéeLe.formatter(),
      nomProjet,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
