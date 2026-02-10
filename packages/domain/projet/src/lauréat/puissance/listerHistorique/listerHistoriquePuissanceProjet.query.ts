import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { PuissanceEvent } from '../puissance.event.js';

export type HistoriquePuissanceProjetListItemReadModel = HistoryRecord<'puissance', PuissanceEvent>;

export type ListerHistoriquePuissanceProjetReadModel = {
  items: ReadonlyArray<HistoriquePuissanceProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriquePuissanceProjetQuery = Message<
  'Lauréat.Puissance.Query.ListerHistoriquePuissanceProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriquePuissanceProjetReadModel
>;

export type ListerHistoriquePuissanceProjetDependencies = {
  listHistory: ListHistory<HistoriquePuissanceProjetListItemReadModel>;
};

export const registerListerHistoriquePuissanceProjetQuery = ({
  listHistory,
}: ListerHistoriquePuissanceProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriquePuissanceProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'puissance',
      range,
    });

  mediator.register('Lauréat.Puissance.Query.ListerHistoriquePuissanceProjet', handler);
};
