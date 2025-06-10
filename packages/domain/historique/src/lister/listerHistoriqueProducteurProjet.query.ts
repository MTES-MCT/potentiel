import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export type HistoriqueProducteurProjetListItemReadModel = HistoryRecord<
  'producteur',
  Lauréat.Producteur.ProducteurEvent['type'],
  Lauréat.Producteur.ProducteurEvent['payload']
>;

export type ListerHistoriqueProducteurProjetReadModel = {
  items: ReadonlyArray<HistoriqueProducteurProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueProducteurProjetQuery = Message<
  'Historique.Query.ListerHistoriqueProducteurProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueProducteurProjetReadModel
>;

export type ListerHistoriqueProducteurProjetDependencies = {
  listHistory: ListHistory<HistoriqueProducteurProjetListItemReadModel>;
};

export const registerListerHistoriqueProducteurProjetQuery = ({
  listHistory,
}: ListerHistoriqueProducteurProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueProducteurProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'producteur',
      range,
    });

  mediator.register('Historique.Query.ListerHistoriqueProducteurProjet', handler);
};
