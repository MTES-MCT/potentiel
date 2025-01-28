import { Message, MessageHandler, mediator } from 'mediateur';

import { ListHistory, ListHistoryResult, RangeOptions } from '@potentiel-domain/entity';

export type ListerHistoriqueProjetReadModel = ListHistoryResult;

export type ListerHistoriqueProjetQuery = Message<
  'Historique.Query.ListerHistoriqueProjet',
  {
    identifiantProjet: string;
    category?: 'abandon' | 'recours' | 'actionnaire' | 'représentant-légal';
    range?: RangeOptions;
  },
  ListerHistoriqueProjetReadModel
>;

export type ListerHistoriqueProjetDependencies = {
  listHistory: ListHistory;
};

export const registerListerHistoriqueProjetQuery = ({
  listHistory,
}: ListerHistoriqueProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueProjetQuery> = ({
    identifiantProjet,
    category,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category,
      range,
    });
  mediator.register('Historique.Query.ListerHistoriqueProjet', handler);
};
