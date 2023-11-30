import { mediator } from 'mediateur';
import { AppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ListerTâcheQuery, ListerTâcheReadModel } from '@potentiel-domain/tache';

import { displayDate } from '@/utils/displayDate';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { TâcheListPage } from '@/components/pages/tâche/TâcheListPage';
import { getUser } from '@/utils/getUtilisateur';
import { OperationRejectedError } from '@potentiel-domain/core';

type PageProps = {
  searchParams?: Record<string, string>;
};

export default async function Page({ searchParams }: IdentifiantParameter & PageProps) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const appelOffre = searchParams?.appelOffre;

  const utilisateur = await getUser();

  if (utilisateur) {
    const appelOffres = await mediator.send<AppelOffreQuery>({
      type: 'LISTER_APPEL_OFFRE_QUERY',
      data: {},
    });

    const tâches = await mediator.send<ListerTâcheQuery>({
      type: 'LISTER_TÂCHES_QUERY',
      data: {
        pagination: { page, itemsPerPage: 10 },
        email: utilisateur.email,
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
  }

  throw new OperationRejectedError('Utilisateur non connecté');
}

const mapToListProps = (
  readModel: ListerTâcheReadModel,
): Parameters<typeof TâcheListPage>[0]['list'] => {
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
