import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

export type ListerHistoriqueProjetReadModel<TRecord extends HistoryRecord = HistoryRecord> =
  ListHistoryResult<TRecord>;

export type ListerHistoriqueProjetQuery<TRecord extends HistoryRecord = HistoryRecord> = Message<
  'Historique.Query.ListerHistoriqueProjet',
  {
    identifiantProjet: string;
    category?: TRecord['category'];
    range?: RangeOptions;
  },
  ListerHistoriqueProjetReadModel<TRecord>
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
