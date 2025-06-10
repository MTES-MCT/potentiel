import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export type HistoriquePuissanceProjetListItemReadModel = HistoryRecord<
  'puissance',
  Lauréat.Puissance.PuissanceEvent['type'],
  Lauréat.Puissance.PuissanceEvent['payload']
>;

export type ListerHistoriquePuissanceProjetReadModel = {
  items: ReadonlyArray<HistoriquePuissanceProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriquePuissanceProjetQuery = Message<
  'Historique.Query.ListerHistoriquePuissanceProjet',
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

  mediator.register('Historique.Query.ListerHistoriquePuissanceProjet', handler);
};
