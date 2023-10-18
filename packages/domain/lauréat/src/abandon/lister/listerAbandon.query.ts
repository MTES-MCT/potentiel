import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonReadModel } from '../abandon.readmodel';
import { List, ListResult } from '../../../common/common.port';

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    recandidature?: boolean;
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
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    pagination: { page, itemsPerPage },
  }) => {
    return await list<AbandonReadModel>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where: recandidature
        ? {
            demandeRecandidature: recandidature,
          }
        : undefined,
      orderBy: {
        property: 'demandeDemandéLe',
        ascending: false,
      },
    });
  };

  mediator.register('LISTER_ABANDONS_QUERY', handler);
};
