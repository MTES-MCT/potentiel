import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { RecoursEvent } from '../recours.event.js';

export type HistoriqueRecoursProjetListItemReadModel = HistoryRecord<'recours', RecoursEvent>;

export type ListerHistoriqueRecoursProjetReadModel = {
  items: ReadonlyArray<HistoriqueRecoursProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueRecoursProjetQuery = Message<
  'Éliminé.Query.ListerHistoriqueRecoursProjet',
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

  mediator.register('Éliminé.Query.ListerHistoriqueRecoursProjet', handler);
};
