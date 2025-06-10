import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export type HistoriqueAbandonProjetListItemReadModel = HistoryRecord<
  'abandon',
  Lauréat.Abandon.AbandonEvent['type'],
  Lauréat.Abandon.AbandonEvent['payload']
>;

export type ListerHistoriqueAbandonProjetReadModel = {
  items: ReadonlyArray<HistoriqueAbandonProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueAbandonProjetQuery = Message<
  'Historique.Query.ListerHistoriqueAbandonProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueAbandonProjetReadModel
>;

export type ListerHistoriqueAbandonProjetDependencies = {
  listHistory: ListHistory<HistoriqueAbandonProjetListItemReadModel>;
};

export const registerListerHistoriqueAbandonProjetQuery = ({
  listHistory,
}: ListerHistoriqueAbandonProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueAbandonProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'abandon',
      range,
    });

  mediator.register('Historique.Query.ListerHistoriqueAbandonProjet', handler);
};
