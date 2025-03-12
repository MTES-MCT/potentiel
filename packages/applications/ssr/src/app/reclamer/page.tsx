import { Metadata } from 'next';
import { mediator } from 'mediateur';

import {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from '@potentiel-domain/utilisateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { ListFilterItem } from '@/components/molecules/ListFilters';

import { PageWithErrorHandling } from '../../utils/PageWithErrorHandling';
import { withUtilisateur } from '../../utils/withUtilisateur';
import { mapToRangeOptions } from '../../utils/pagination';
import { RéclamerProjetsListItemProps } from '../../components/pages/réclamer-projets/RéclamerProjetsListItem';
import { RéclamerProjetsListPage } from '../../components/pages/réclamer-projets/RéclamerProjetList.page';

type SearchParams = 'page' | 'appelOffre' | 'statut' | 'nomProjet';

type PageProps = {
  searchParams?: Partial<Record<SearchParams, string>>;
};

export const metadata: Metadata = {
  title: 'Réclamer un ou plusieurs projets - Potentiel',
  description: 'Liste des projets à réclamer',
};

export default async function Page({ searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;
      const appelOffre = searchParams?.appelOffre ?? undefined;
      const statut = searchParams?.statut
        ? Candidature.StatutCandidature.convertirEnValueType(searchParams?.statut).statut
        : undefined;
      const nomProjet = searchParams?.nomProjet ?? undefined;

      const projetsÀRéclamer = await mediator.send<ListerProjetsÀRéclamerQuery>({
        type: 'Utilisateur.Query.ListerProjetsÀRéclamer',
        data: {
          appelOffre,
          statut: statut
            ? Candidature.StatutCandidature.convertirEnValueType(statut).statut
            : undefined,
          nomProjet,
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

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
        },
        {
          label: 'Statut',
          searchParamKey: 'statut',
          options: [
            {
              label: 'Classé',
              value: Candidature.StatutCandidature.classé.statut,
            },
            {
              label: 'Éliminé',
              value: Candidature.StatutCandidature.éliminé.statut,
            },
          ],
        },
      ];

      return (
        <RéclamerProjetsListPage
          filters={filters}
          projets={mapToProps(
            projetsÀRéclamer.items,
            utilisateur.identifiantUtilisateur.formatter(),
          )}
          range={projetsÀRéclamer.range}
          total={projetsÀRéclamer.total}
        />
      );
    }),
  );
}

const mapToProps = (
  projets: ListerProjetsÀRéclamerReadModel['items'],
  emailUtilisateur: string,
): Array<RéclamerProjetsListItemProps> =>
  projets.map((projet) => ({
    identifiantProjet: projet.identifiantProjet.formatter(),
    nomProjet: projet.nomProjet,
    userHasSameEmail: projet.emailContact === emailUtilisateur,
    puissance: projet.puissance,
    région: projet.région,
  }));
