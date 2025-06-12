import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Éliminé } from '@potentiel-domain/projet';

export type HistoriqueRecoursProjetListItemReadModel = HistoryRecord<
  'recours',
  Éliminé.Recours.RecoursEvent['type'],
  Éliminé.Recours.RecoursEvent['payload']
>;

export type ListerHistoriqueRecoursProjetReadModel = {
  items: ReadonlyArray<HistoriqueRecoursProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueRecoursProjetQuery = Message<
  'Historique.Query.ListerHistoriqueRecoursProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueRecoursProjetReadModel
>;

export type ListerHistoriqueRecoursProjetDependencies = {
  listHistory: ListHistory<HistoriqueRecoursProjetListItemReadModel>;
};

export const registerListerHistoriqueRecoursProjetQuery = ({
  listHistory,
}: ListerHistoriqueRecoursProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueRecoursProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'recours',
      range,
    });

  mediator.register('Historique.Query.ListerHistoriqueRecoursProjet', handler);
};
