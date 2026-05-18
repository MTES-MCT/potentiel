import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import type { RaccordementEvent } from '../raccordement.event.js';

export type HistoriqueRaccordementProjetListItemReadModel = HistoryRecord<
  'raccordement',
  RaccordementEvent
>;

export type ListerHistoriqueRaccordementProjetReadModel = {
  items: ReadonlyArray<HistoriqueRaccordementProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueRaccordementProjetQuery = Message<
  'Lauréat.Raccordement.Query.ListerHistoriqueRaccordementProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueRaccordementProjetReadModel
>;

export type ListerHistoriqueRaccordementProjetDependencies = {
  listHistory: ListHistory<HistoriqueRaccordementProjetListItemReadModel>;
};

export const registerListerHistoriqueRaccordementProjetQuery = ({
  listHistory,
}: ListerHistoriqueRaccordementProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueRaccordementProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'raccordement',
      range,
    });

  mediator.register('Lauréat.Raccordement.Query.ListerHistoriqueRaccordementProjet', handler);
};
