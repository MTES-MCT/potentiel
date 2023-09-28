import { Message, MessageHandler, mediator } from 'mediateur';
import { List, ListResult } from '@potentiel/core-domain-views';
import { AbandonReadModel } from '../abandon.readmodel';

export type ListerAbandonAvecRecandidatureQuery = Message<
  'LISTER_ABANDON_AVEC_RECANDIDATURE_QUERY',
  {
    pagination: { page: number; itemsPerPage: number };
  },
  ListResult<AbandonReadModel>
>;

export type ListerAbandonAvecRecandidatureDependencies = {
  list: List;
};

export const registerListerAbandonAvecRecandidatureQuery = ({
  list,
}: ListerAbandonAvecRecandidatureDependencies) => {
  const handler: MessageHandler<ListerAbandonAvecRecandidatureQuery> = async ({
    pagination: { page, itemsPerPage },
  }) => {
    return await list<AbandonReadModel>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where: {
        demandeRecandidature: true,
      },
      orderBy: {
        property: 'demandeDemandéLe',
        ascending: false,
      },
    });
  };

  mediator.register('LISTER_ABANDON_AVEC_RECANDIDATURE_QUERY', handler);
};
