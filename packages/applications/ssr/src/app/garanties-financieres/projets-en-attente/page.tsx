import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from '@/components/pages/garanties-financières/en-attente/lister/ListerProjetsAvecGarantiesFinancièresEnAttente.page';
import { getGarantiesFinancièresMotifLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresMotifLabel';
import { mapToRangeOptions, mapToPagination } from '@/utils/pagination';
import { ListPageTemplateProps } from '@/components/templates/ListPage.template';
import { ListItemProjetAvecGarantiesFinancièresEnAttenteProps } from '@/components/pages/garanties-financières/en-attente/lister/ListItemProjetAvecGarantiesFinancièresEnAttente';
import { getRégionUtilisateur } from '@/utils/getRégionUtilisateur';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Projets en attente de garanties financières - Potentiel',
  description: 'Liste des projets pour lesquels de nouvelles garanties financières sont attendues',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre;
      const motif = searchParams?.motif;
      const cycle = searchParams?.cycle;

      const régionDreal = await getRégionUtilisateur(utilisateur);

      const projetsAvecGarantiesFinancièresEnAttente =
        await mediator.send<GarantiesFinancières.ListerProjetsAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
            data: {
              utilisateur: {
                régionDreal,
                identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
                rôle: utilisateur.role.nom,
              },
              appelOffre,
              motif,
              cycle,
              range: mapToRangeOptions({ currentPage: page, itemsPerPage: 10 }),
            },
          },
        );

      const appelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      const filters: ListPageTemplateProps<ListItemProjetAvecGarantiesFinancièresEnAttenteProps>['filters'] =
        [
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
          {
            label: 'Motif',
            searchParamKey: 'motif',
            options: GarantiesFinancières.MotifDemandeGarantiesFinancières.motifs.map((motif) => ({
              label: getGarantiesFinancièresMotifLabel(motif),
              value: motif,
            })),
          },
        ];

      return (
        <ListProjetsAvecGarantiesFinancièresEnAttentePage
          list={mapToListProps(projetsAvecGarantiesFinancièresEnAttente, utilisateur.role)}
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
  role: Role.ValueType,
): ListProjetsAvecGarantiesFinancièresEnAttenteProps['list'] => {
  const mappedItems = items.map(
    ({ identifiantProjet, nomProjet, motif, dernièreMiseÀJour, dateLimiteSoumission }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      motif: getGarantiesFinancièresMotifLabel(motif.motif),
      misÀJourLe: dernièreMiseÀJour.date.formatter(),
      dateLimiteSoumission: dateLimiteSoumission.formatter(),
      afficherModèleMiseEnDemeure:
        dateLimiteSoumission.estAntérieurÀ(DateTime.now()) && role.estÉgaleÀ(Role.dreal),
    }),
  );

  return {
    items: mappedItems,
    totalItems: total,
    ...mapToPagination(range, 10),
  };
};
