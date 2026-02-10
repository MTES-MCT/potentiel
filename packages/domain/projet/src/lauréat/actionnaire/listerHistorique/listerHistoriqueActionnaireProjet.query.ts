import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { ActionnaireEvent } from '../actionnaire.event.js';

export type HistoriqueActionnaireProjetListItemReadModel = HistoryRecord<
  'actionnaire',
  ActionnaireEvent
>;

export type ListerHistoriqueActionnaireProjetReadModel = {
  items: ReadonlyArray<HistoriqueActionnaireProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueActionnaireProjetQuery = Message<
  'Lauréat.Actionnaire.Query.ListerHistoriqueActionnaireProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueActionnaireProjetReadModel
>;

export type ListerHistoriqueActionnaireProjetDependencies = {
  listHistory: ListHistory<HistoriqueActionnaireProjetListItemReadModel>;
};

export const registerListerHistoriqueActionnaireProjetQuery = ({
  listHistory,
}: ListerHistoriqueActionnaireProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueActionnaireProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'actionnaire',
      range,
    });

  mediator.register('Lauréat.Actionnaire.Query.ListerHistoriqueActionnaireProjet', handler);
};
