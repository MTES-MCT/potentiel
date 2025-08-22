import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import {
  convertMotifMainlevéeForView,
  convertStatutMainlevéeForView,
} from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/_helpers';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToPagination, mapToRangeOptions } from '@/utils/pagination';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ListeDemandeMainlevéePage,
  type ListeDemandeMainlevéeProps,
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

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const demandeMainlevéeDesGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            utilisateur: {
              régionDreal,
              identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
              rôle: utilisateur.role.nom,
            },
            ...(appelOffre && { appelOffre }),
            ...(motif && {
              motif:
                Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
                  motif,
                ).motif,
            }),
            ...(statut && {
              statut:
                GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
                  statut,
                ).statut,
            }),
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
          options: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statuts.map(
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
}: GarantiesFinancières.ListerMainlevéesReadModel & {
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
        !GarantiesFinancières.StatutMainlevéeGarantiesFinancières.convertirEnValueType(
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
