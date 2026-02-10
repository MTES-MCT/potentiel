import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { ReprésentantLégalEvent } from '../représentantLégal.event.js';

export type HistoriqueReprésentantLégalProjetListItemReadModel = HistoryRecord<
  'représentant-légal',
  ReprésentantLégalEvent
>;

export type ListerHistoriqueReprésentantLégalProjetReadModel = {
  items: ReadonlyArray<HistoriqueReprésentantLégalProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueReprésentantLégalProjetQuery = Message<
  'Lauréat.ReprésentantLégal.Query.ListerHistoriqueReprésentantLégalProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueReprésentantLégalProjetReadModel
>;

export type ListerHistoriqueReprésentantLégalProjetDependencies = {
  listHistory: ListHistory<HistoriqueReprésentantLégalProjetListItemReadModel>;
};

export const registerListerHistoriqueReprésentantLégalProjetQuery = ({
  listHistory,
}: ListerHistoriqueReprésentantLégalProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueReprésentantLégalProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'représentant-légal',
      range,
    });

  mediator.register(
    'Lauréat.ReprésentantLégal.Query.ListerHistoriqueReprésentantLégalProjet',
    handler,
  );
};
