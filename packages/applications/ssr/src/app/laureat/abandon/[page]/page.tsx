import { mediator } from 'mediateur';
import { AppelOffreQuery } from '@potentiel-domain/appel-offre';
import { Abandon } from '@potentiel-domain/laureat';

import { AbandonListPage } from '@/components/pages/abandon/AbandonListPage';
import { displayDate } from '@/utils/displayDate';

type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const page = params?.page ? parseInt(params.page) : 1;

  const recandidature =
    searchParams?.recandidature !== undefined ? searchParams.recandidature === 'true' : undefined;

  const statut = searchParams?.statut
    ? Abandon.StatutAbandon.convertirEnValueType(searchParams.statut).statut
    : undefined;

  const appelOffre = searchParams?.appelOffre;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page, itemsPerPage: 10 },
      recandidature,
      statut,
      appelOffre,
    },
  });

  const appelOffres = await mediator.send<AppelOffreQuery>({
    type: 'LISTER_APPEL_OFFRE_QUERY',
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
    {
      label: 'Recandidature',
      searchParamKey: 'recandidature',
      defaultValue: searchParams?.recandidature,
      options: [
        {
          label: 'Avec recandidature',
          value: 'true',
        },
        {
          label: 'Sans recandidature',
          value: 'false',
        },
      ],
    },
    {
      label: 'Statut',
      searchParamKey: 'statut',
      defaultValue: statut,
      options: Abandon.StatutAbandon.statuts
        .filter((s) => s !== 'inconnu')
        .map((statut) => ({
          label: statut.replace('-', ' ').toLocaleLowerCase(),
          value: statut,
        })),
    },
  ];

  console.table(filters);

  return <AbandonListPage list={mapToListProps(abandons)} filters={filters} />;
}

const mapToListProps = (
  readModel: Abandon.ListerAbandonReadModel,
): Parameters<typeof AbandonListPage>[0]['list'] => {
  const items = readModel.items.map(
    ({
      identifiantProjet,
      appelOffre,
      période,
      famille,
      nomProjet,
      statut: { statut },
      misÀJourLe,
      recandidature,
    }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre,
      période,
      famille,
      statut,
      misÀJourLe: displayDate(misÀJourLe.date),
      recandidature,
    }),
  );

  return {
    items,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
