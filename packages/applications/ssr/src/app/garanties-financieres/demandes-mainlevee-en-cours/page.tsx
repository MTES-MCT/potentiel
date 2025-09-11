import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Role } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import {
  convertMotifMainlevéeForView,
  convertStatutMainlevéeForView,
} from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/_helpers';

import {
  ListeDemandeMainlevéePage,
  ListeDemandeMainlevéeProps,
} from './ListeDemandeMainlevée.page';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Demande de mainlevée des garanties financières - Potentiel',
  description: 'Liste des demandes de mainlevée des garanties financières',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;
      const motif = searchParams?.motif;
      const statut = searchParams?.statut;

      const demandeMainlevéeDesGarantiesFinancières =
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
          data: {
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            appelOffre,

            motif: motif
              ? Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
                  motif,
                ).motif
              : undefined,
            statut: statut
              ? Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
                  statut,
                ).statut
              : undefined,
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

      const motifMainlevée =
        Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.motifs;

      const filters = [
        {
          label: `Statut de mainlevée`,
          searchParamKey: 'statut',
          options: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statuts.map(
            (statut) => ({
              label: convertStatutMainlevéeForView(statut),
              value: statut,
            }),
          ),
        },
        {
          label: 'Motif de mainlevée',
          searchParamKey: 'motif',
          options: motifMainlevée.map((motif) => ({
            label: convertMotifMainlevéeForView(motif),
            value: motif,
          })),
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
        <ListeDemandeMainlevéePage
          list={mapToListProps({
            ...demandeMainlevéeDesGarantiesFinancières,
            isDreal: utilisateur.role.estÉgaleÀ(Role.dreal),
          })}
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
  isDreal,
}: Lauréat.GarantiesFinancières.ListerMainlevéesReadModel & {
  isDreal: boolean;
}): ListeDemandeMainlevéeProps['list'] => {
  const mappedItems = items.map(
    ({ appelOffre, demande, dernièreMiseÀJour, identifiantProjet, motif, nomProjet, statut }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      statut: statut.statut,
      demandéLe: demande.demandéeLe.formatter(),
      nomProjet,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      appelOffre,
      peutInstruireMainlevée:
        isDreal &&
        !Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
          statut.statut,
        ).estRejeté(),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
