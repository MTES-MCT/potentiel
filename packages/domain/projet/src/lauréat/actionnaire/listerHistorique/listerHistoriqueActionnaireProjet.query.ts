import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Actionnaire } from '@potentiel-domain/laureat';

export type HistoriqueActionnaireProjetListItemReadModel = HistoryRecord<
  'actionnaire',
  Actionnaire.ActionnaireEvent['type'],
  Actionnaire.ActionnaireEvent['payload']
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
