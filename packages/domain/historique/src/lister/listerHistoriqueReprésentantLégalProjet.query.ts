import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export type HistoriqueReprésentantLégalProjetListItemReadModel = HistoryRecord<
  'représentant-légal',
  ReprésentantLégal.ReprésentantLégalEvent['type'],
  ReprésentantLégal.ReprésentantLégalEvent['payload']
>;

export type ListerHistoriqueReprésentantLégalProjetReadModel = {
  items: ReadonlyArray<HistoriqueReprésentantLégalProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueReprésentantLégalProjetQuery = Message<
  'Historique.Query.ListerHistoriqueReprésentantLégalProjet',
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

  mediator.register('Historique.Query.ListerHistoriqueReprésentantLégalProjet', handler);
};
