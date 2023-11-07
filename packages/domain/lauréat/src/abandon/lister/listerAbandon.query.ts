import { Message, MessageHandler, mediator } from 'mediateur';
import { AbandonProjection } from '../abandon.projection';
import { List } from '@potentiel-libraries/projection';

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonProjection>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    recandidature?: boolean;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  list: List;
};

export const registerListerAbandonQuery = ({ list }: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    pagination: { page, itemsPerPage },
  }) => {
    return await list<AbandonProjection>({
      type: 'abandon',
      pagination: { page, itemsPerPage },
      where:
        recandidature !== undefined
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
