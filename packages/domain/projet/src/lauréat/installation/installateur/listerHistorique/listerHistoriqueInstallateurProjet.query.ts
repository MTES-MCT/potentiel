import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { InstallateurEvent } from '../installateur.event';

export type HistoriqueInstallateurProjetListItemReadModel = HistoryRecord<
  'installateur',
  InstallateurEvent
>;

export type ListerHistoriqueInstallateurProjetReadModel = {
  items: ReadonlyArray<HistoriqueInstallateurProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueInstallateurProjetQuery = Message<
  'Lauréat.Installation.Query.ListerHistoriqueInstallateurProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueInstallateurProjetReadModel
>;

export type ListerHistoriqueInstallateurProjetDependencies = {
  listHistory: ListHistory<HistoriqueInstallateurProjetListItemReadModel>;
};

export const registerListerHistoriqueInstallateurProjetQuery = ({
  listHistory,
}: ListerHistoriqueInstallateurProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueInstallateurProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'installateur',
      range,
    });

  mediator.register('Lauréat.Installation.Query.ListerHistoriqueInstallateurProjet', handler);
};
