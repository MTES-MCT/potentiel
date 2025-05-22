import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Accès } from '@potentiel-domain/projet';

import { ListFilterItem } from '@/components/molecules/ListFilters';
import {
  chiffrerIdentifiantProjet,
  generateIV,
} from '@/components/pages/réclamer-projets/_utils/chiffrement';

import { PageWithErrorHandling } from '../../utils/PageWithErrorHandling';
import { withUtilisateur } from '../../utils/withUtilisateur';
import { mapToRangeOptions } from '../../utils/pagination';
import { RéclamerProjetsListItemProps } from '../../components/pages/réclamer-projets/RéclamerProjetsListItem';
import { RéclamerProjetsListPage } from '../../components/pages/réclamer-projets/RéclamerProjetList.page';

type SearchParams = 'page' | 'appelOffre' | 'periode' | 'nomProjet';

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
      const nomProjet = searchParams?.nomProjet ?? undefined;
      const période = searchParams?.periode ?? undefined;

      const projetsÀRéclamer = await mediator.send<Accès.ListerProjetsÀRéclamerQuery>({
        type: 'Projet.Accès.Query.ListerProjetsÀRéclamer',
        data: {
          appelOffre,
          période,
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

      const périodesOption =
        appelOffres.items
          .find((appelOffresItem) => appelOffresItem.id === appelOffre)
          ?.periodes.map((p) => ({
            label: p.title,
            value: p.id,
          })) ?? [];

      const filters: ListFilterItem<SearchParams>[] = [
        {
          label: `Appel d'offres`,
          searchParamKey: 'appelOffre',
          options: appelOffres.items.map((appelOffre) => ({
            label: appelOffre.id,
            value: appelOffre.id,
          })),
          affects: ['periode'],
        },
        {
          label: `Période`,
          searchParamKey: 'periode',
          options: périodesOption,
        },
      ];

      const iv = generateIV();

      return (
        <RéclamerProjetsListPage
          filters={filters}
          projets={mapToProps(
            projetsÀRéclamer.items,
            utilisateur.identifiantUtilisateur.formatter(),
            iv,
          )}
          range={projetsÀRéclamer.range}
          total={projetsÀRéclamer.total}
        />
      );
    }),
  );
}

const mapToProps = (
  projets: Accès.ListerProjetsÀRéclamerReadModel['items'],
  emailUtilisateur: string,
  iv: string,
): Array<RéclamerProjetsListItemProps> =>
  projets.map((projet) => {
    const identifiantProjetChiffré = chiffrerIdentifiantProjet(
      projet.identifiantProjet.formatter(),
      iv,
    );
    return {
      identifiantProjet: identifiantProjetChiffré,
      appelOffre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      famille: projet.identifiantProjet.famille,
      nomProjet: projet.nomProjet,
      userHasSameEmail: projet.emailContact === emailUtilisateur,
      puissance: projet.puissance,
      région: projet.région,
      iv,
    };
  });
