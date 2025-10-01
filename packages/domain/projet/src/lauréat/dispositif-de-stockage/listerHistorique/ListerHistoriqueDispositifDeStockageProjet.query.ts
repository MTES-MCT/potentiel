import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { DispositifDeStockageEvent } from '../dispositifDeStockage.event';

export type HistoriqueDispositifDeStockageProjetListItemReadModel = HistoryRecord<
  'dispositif-de-stockage',
  DispositifDeStockageEvent
>;

export type ListerHistoriqueDispositifDeStockageProjetReadModel = {
  items: ReadonlyArray<HistoriqueDispositifDeStockageProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueDispositifDeStockageProjetQuery = Message<
  'Lauréat.DispositifDeStockage.Query.ListerHistoriqueDispositifDeStockageProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueDispositifDeStockageProjetReadModel
>;

export type ListerHistoriqueDispositifDeStockageProjetDependencies = {
  listHistory: ListHistory<HistoriqueDispositifDeStockageProjetListItemReadModel>;
};

export const registerListerHistoriqueDispositifDeStockageProjetQuery = ({
  listHistory,
}: ListerHistoriqueDispositifDeStockageProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueDispositifDeStockageProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'dispositif-de-stockage',
      range,
    });

  mediator.register(
    'Lauréat.DispositifDeStockage.Query.ListerHistoriqueDispositifDeStockageProjet',
    handler,
  );
};
