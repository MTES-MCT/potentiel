import { mediator } from 'mediateur';
import { AppelOffresQuery } from '@potentiel-domain/appel-offres';
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

  const appelOffres = searchParams?.appelOffres;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page, itemsPerPage: 10 },
      recandidature,
      statut,
      appelOffres,
    },
  });

  const appelsOffres = await mediator.send<AppelOffresQuery>({
    type: 'LISTER_APPEL_OFFRES_QUERY',
    data: {},
  });

  const filters = [
    {
      label: `Appel d'offres`,
      searchParamKey: 'appelOffres',
      options: appelsOffres.items.map((appelOffres) => ({
        label: appelOffres.id,
        value: appelOffres.id,
      })),
    },
    {
      label: 'Recandidature',
      searchParamKey: 'recandidature',
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
      options: Abandon.StatutAbandon.statuts
        .filter((s) => s !== 'inconnu')
        .map((statut) => ({
          label: statut.replace('-', ' ').toLocaleLowerCase(),
          value: statut,
        })),
    },
  ];

  return <AbandonListPage list={mapToListProps(abandons)} filters={filters} />;
}

const mapToListProps = (
  readModel: Abandon.ListerAbandonReadModel,
): Parameters<typeof AbandonListPage>[0]['list'] => {
  const items = readModel.items.map(
    ({ identifiantProjet, nomProjet, statut: { statut }, misÀJourLe, recandidature }) => ({
      identifiantProjet: identifiantProjet.formatter(),
      nomProjet,
      appelOffre: identifiantProjet.appelOffre,
      période: identifiantProjet.période,
      famille: identifiantProjet.famille,
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
