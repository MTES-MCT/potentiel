import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import {
  convertMotifMainlevéeForView,
  convertStatutMainlevéeForView,
} from '@/components/pages/garanties-financières/mainlevée/convertForView';
import {
  ListeDemandeMainlevéePage,
  ListeDemandeMainlevéeProps,
} from '@/components/pages/garanties-financières/mainlevée/lister/ListeDemandeMainlevée.page';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

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
        await mediator.send<GarantiesFinancières.ListerDemandeMainlevéeQuery>({
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
                GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
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

      const statutsMainlevéeEnCours =
        GarantiesFinancières.StatutMainlevéeGarantiesFinancières.statuts.filter(
          (s) => s !== 'rejeté',
        );

      const motifMainlevéeEnCours =
        GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.motifs;

      const filters = [
        {
          label: `Statut de mainlevée`,
          searchParamKey: 'statut',
          defaultValue: statut,
          options: statutsMainlevéeEnCours.map((statut) => ({
            label: convertStatutMainlevéeForView(statut),
            value: statut,
          })),
        },
        {
          label: 'Motif de mainlevée',
          searchParamKey: 'motif',
          defaultValue: motif,
          options: motifMainlevéeEnCours.map((motif) => ({
            label: convertMotifMainlevéeForView(motif),
            value: motif,
          })),
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
        <ListeDemandeMainlevéePage
          list={mapToListProps({
            ...demandeMainlevéeDesGarantiesFinancières,
            showInstruction: utilisateur.role.estÉgaleÀ(Role.dreal),
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
  showInstruction,
}: GarantiesFinancières.ListerDemandeMainlevéeReadModel & {
  showInstruction: boolean;
}): ListeDemandeMainlevéeProps['list'] => {
  const mappedItems = items.map(
    ({
      appelOffre,
      demande,
      dernièreMiseÀJour,
      famille,
      identifiantProjet,
      motif,
      nomProjet,
      période,
      régionProjet,
      statut,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      motif: motif.motif,
      statut: statut.statut,
      demandéLe: demande.demandéeLe.formatter(),
      nomProjet,
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      appelOffre,
      famille,
      période,
      régionProjet,
      showInstruction,
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
