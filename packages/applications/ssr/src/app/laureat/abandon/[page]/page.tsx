import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { ListeAbandonsPage } from '@/components/pages/abandon/ListeAbandonsPage';
import { displayDate } from '@/utils/displayDate';

// import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
// const abandons: Abandon.ListerAbandonReadModel = {
//   currentPage: 1,
//   totalItems: 3,
//   itemsPerPage: 10,
//   items: [
//     {
//       identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 Toto#1#2#3'),
//       misÀJourLe: DateTime.convertirEnValueType(new Date().toISOString()),
//       nomProjet: 'Projet',
//       recandidature: false,
//       statut: Abandon.StatutAbandon.convertirEnValueType('demandé'),
//     },
//     {
//       identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 Toto#1#2#4'),
//       misÀJourLe: DateTime.convertirEnValueType(new Date().toISOString()),
//       nomProjet: 'Projet',
//       recandidature: false,
//       statut: Abandon.StatutAbandon.convertirEnValueType('demandé'),
//     },
//     {
//       identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 Toto#1##5'),
//       misÀJourLe: DateTime.convertirEnValueType(new Date().toISOString()),
//       nomProjet: 'Projet',
//       recandidature: true,
//       statut: Abandon.StatutAbandon.convertirEnValueType('demandé'),
//     },
//   ],
// };

type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const page = params?.page ? parseInt(params.page) : 1;

  const recandidature =
    searchParams?.recandidature !== undefined ? !!searchParams.recandidature : undefined;
  const statut = searchParams?.statut
    ? Abandon.StatutAbandon.convertirEnValueType(searchParams.statut).statut
    : undefined;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page, itemsPerPage: 10 },
      recandidature: recandidature,
      statut,
    },
  });

  return <ListeAbandonsPage abandons={mapToProps(abandons)} />;
}

const mapToProps = (
  readModel: Abandon.ListerAbandonReadModel,
): Parameters<typeof ListeAbandonsPage>[0]['abandons'] => {
  return {
    ...readModel,
    items: readModel.items.map(
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
    ),
  };
};
