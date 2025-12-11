import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { DélaiEvent } from '../délai.event';

export type HistoriqueDélaiProjetListItemReadModel = HistoryRecord<'délai', DélaiEvent>;

export type ListerHistoriqueDélaiProjetReadModel = {
  items: ReadonlyArray<HistoriqueDélaiProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueDélaiProjetQuery = Message<
  'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
  {
    identifiantProjet: string;
  },
  ListerHistoriqueDélaiProjetReadModel
>;

export type ListerHistoriqueDélaiProjetDependencies = {
  listHistory: ListHistory<HistoriqueDélaiProjetListItemReadModel>;
};

export const registerListerHistoriqueDélaiProjetQuery = ({
  listHistory,
}: ListerHistoriqueDélaiProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueDélaiProjetQuery> = async ({ identifiantProjet }) =>
    listHistory({
      id: identifiantProjet,
      category: 'délai',
    });

  mediator.register('Lauréat.Délai.Query.ListerHistoriqueDélaiProjet', handler);
};
