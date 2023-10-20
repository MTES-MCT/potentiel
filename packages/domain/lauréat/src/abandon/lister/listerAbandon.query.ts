import { Message, MessageHandler, mediator } from 'mediateur';
import { QueryPorts } from '@potentiel-domain/common';
import { AbandonProjection } from '../consulter/consulterAbandon.query';

export type ListerAbandonsQuery = Message<
  'LISTER_ABANDONS_QUERY',
  {
    recandidature?: boolean;
    pagination: { page: number; itemsPerPage: number };
  },
  QueryPorts.ListResult<AbandonProjection>
>;

export type ListerAbandonDependencies = {
  list: QueryPorts.List;
};

export const registerListerAbandonQuery = ({ list }: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    pagination: { page, itemsPerPage },
  }) => {
    return await list<AbandonProjection>({
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
