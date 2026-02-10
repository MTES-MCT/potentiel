import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { Lauréat } from '../../index.js';

export type HistoriqueLauréatListItemReadModel = HistoryRecord<'lauréat', Lauréat.LauréatEvent>;

export type ListerHistoriqueLauréatReadModel = {
  items: ReadonlyArray<HistoriqueLauréatListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueLauréatQuery = Message<
  'Lauréat.Query.ListerHistoriqueLauréat',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueLauréatReadModel
>;

export type ListerHistoriqueLauréatDependencies = {
  listHistory: ListHistory<HistoriqueLauréatListItemReadModel>;
};

export const registerListerHistoriqueLauréatQuery = ({
  listHistory,
}: ListerHistoriqueLauréatDependencies) => {
  const handler: MessageHandler<ListerHistoriqueLauréatQuery> = ({ identifiantProjet, range }) =>
    listHistory({
      id: identifiantProjet,
      category: 'lauréat',
      range,
    });

  mediator.register('Lauréat.Query.ListerHistoriqueLauréat', handler);
};
