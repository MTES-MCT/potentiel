import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { AbandonEvent } from '../abandon.event.js';

export type HistoriqueAbandonProjetListItemReadModel = HistoryRecord<'abandon', AbandonEvent>;

export type ListerHistoriqueAbandonProjetReadModel = {
  items: ReadonlyArray<HistoriqueAbandonProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueAbandonProjetQuery = Message<
  'Lauréat.Abandon.Query.ListerHistoriqueAbandonProjet',
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

  mediator.register('Lauréat.Abandon.Query.ListerHistoriqueAbandonProjet', handler);
};
