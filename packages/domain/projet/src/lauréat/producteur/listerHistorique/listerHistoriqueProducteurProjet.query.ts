import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import type { ProducteurEvent } from '../producteur.event.js';

export type HistoriqueProducteurProjetListItemReadModel = HistoryRecord<
  'producteur',
  ProducteurEvent
>;

export type ListerHistoriqueProducteurProjetReadModel = {
  items: ReadonlyArray<HistoriqueProducteurProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueProducteurProjetQuery = Message<
  'Lauréat.Producteur.Query.ListerHistoriqueProducteurProjet',
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

  mediator.register('Lauréat.Producteur.Query.ListerHistoriqueProducteurProjet', handler);
};
