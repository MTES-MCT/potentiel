import { mediator } from 'mediateur';
import { ListerAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ListerTâcheQuery, ListerTâcheReadModel } from '@potentiel-domain/tache';

import { displayDate } from '@/utils/displayDate';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { TâcheListPage, TâcheListPageProps } from '@/components/pages/tâche/TâcheListPage';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import type { Metadata } from 'next';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Tâches - Potentiel',
  description: 'Liste des tâches en attente',
};

export default async function Page({ searchParams }: IdentifiantParameter & PageProps) {
  return PageWithErrorHandling(async () => {
    const page = searchParams?.page ? parseInt(searchParams.page) : 1;

    const appelOffre = searchParams?.appelOffre;

    const accessToken = await mediator.send<GetAccessTokenMessage>({
      type: 'GET_ACCESS_TOKEN',
      data: {},
    });
    const utilisateur = Utilisateur.convertirEnValueType(accessToken);

    const appelOffres = await mediator.send<ListerAppelOffreQuery>({
      type: 'LISTER_APPEL_OFFRE_QUERY',
      data: {},
    });

    const tâches = await mediator.send<ListerTâcheQuery>({
      type: 'LISTER_TÂCHES_QUERY',
      data: {
        pagination: { page, itemsPerPage: 10 },
        email: utilisateur.identifiantUtilisateur.email,
        appelOffre,
      },
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

    return <TâcheListPage list={mapToListProps(tâches)} filters={filters} />;
  });
}

const mapToListProps = (readModel: ListerTâcheReadModel): TâcheListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      appelOffre,
      période,
      famille,
      nomProjet,
      misÀJourLe,
      numéroCRE,
      typeTâche,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      numéroCRE,
      famille,
      misÀJourLe: displayDate(misÀJourLe.date),
      typeTâche: typeTâche.type,
    }),
  );

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
