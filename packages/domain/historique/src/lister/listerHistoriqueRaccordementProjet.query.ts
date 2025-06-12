import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Raccordement } from '@potentiel-domain/laureat';

export type HistoriqueRaccordementProjetListItemReadModel = HistoryRecord<
  'raccordement',
  Raccordement.RaccordementEvent['type'],
  Raccordement.RaccordementEvent['payload']
>;

export type ListerHistoriqueRaccordementProjetReadModel = {
  items: ReadonlyArray<HistoriqueRaccordementProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueRaccordementProjetQuery = Message<
  'Historique.Query.ListerHistoriqueRaccordementProjet',
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

  mediator.register('Historique.Query.ListerHistoriqueRaccordementProjet', handler);
};
