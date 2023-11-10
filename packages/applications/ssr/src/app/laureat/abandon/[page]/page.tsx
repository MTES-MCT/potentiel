import { mediator } from 'mediateur';
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
  console.log(`RECANDIDATURE : ${recandidature}`);

  const statut = searchParams?.statut
    ? Abandon.StatutAbandon.convertirEnValueType(searchParams.statut).statut
    : undefined;

  const abandons = await mediator.send<Abandon.ListerAbandonsQuery>({
    type: 'LISTER_ABANDONS_QUERY',
    data: {
      pagination: { page, itemsPerPage: 10 },
      recandidature,
      statut,
    },
  });

  return (
    <AbandonListPage
      items={mapToProps(abandons)}
      totalItems={abandons.totalItems}
      itemsPerPage={abandons.itemsPerPage}
    />
  );
}

const mapToProps = (
  readModel: Abandon.ListerAbandonReadModel,
): Parameters<typeof AbandonListPage>[0]['items'] => {
  return readModel.items.map(
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
};
